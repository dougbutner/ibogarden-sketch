<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "error" => "Missing config.php. Copy config.example.php to config.php and fill in credentials.",
  ]);
  exit;
}

require $configPath;

if (
  ADMIN_DATA_API_SECRET === "replace_with_long_random_secret" ||
  DB_PASSWORD === "your_database_password"
) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "error" => "config.php still has placeholder values.",
  ]);
  exit;
}

function respond(int $status, array $payload): never {
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function toIso(?string $value): ?string {
  return $value !== null && $value !== "" ? str_replace(" ", "T", $value) . "Z" : null;
}

if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== "POST") {
  respond(405, ["ok" => false, "error" => "Method not allowed"]);
}

$secret = $_SERVER["HTTP_X_ADMIN_SECRET"] ?? "";
if (!is_string($secret) || !hash_equals(ADMIN_DATA_API_SECRET, $secret)) {
  respond(401, ["ok" => false, "error" => "Unauthorized"]);
}

$raw = file_get_contents("php://input");
$body = json_decode($raw ?: "{}", true);
if (!is_array($body)) {
  respond(400, ["ok" => false, "error" => "Invalid JSON"]);
}

$action = (string)($body["action"] ?? "");
if ($action === "") {
  respond(400, ["ok" => false, "error" => "Missing action"]);
}

$mysqli = @new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);
if ($mysqli->connect_errno) {
  respond(500, ["ok" => false, "error" => "DB connect failed: " . $mysqli->connect_error]);
}
$mysqli->set_charset("utf8mb4");

try {
  switch ($action) {
    case "admin.health":
      $result = $mysqli->query("SELECT COUNT(*) AS taxonomy_terms FROM taxonomy_terms");
      if (!$result) {
        throw new RuntimeException($mysqli->error);
      }
      $row = $result->fetch_assoc() ?: ["taxonomy_terms" => 0];
      respond(200, [
        "ok" => true,
        "data" => [
          "connected" => true,
          "taxonomyTerms" => (int)$row["taxonomy_terms"],
        ],
      ]);

    case "admin.waitlist":
      $search = trim((string)($body["search"] ?? ""));
      if ($search !== "") {
        $stmt = $mysqli->prepare(
          "SELECT id, email, source, wallet_address, user_account_id, created_at, linked_at
           FROM community_waitlist
           WHERE email LIKE CONCAT('%', ?, '%') OR source LIKE CONCAT('%', ?, '%')
           ORDER BY created_at DESC LIMIT 100"
        );
        $stmt->bind_param("ss", $search, $search);
      } else {
        $stmt = $mysqli->prepare(
          "SELECT id, email, source, wallet_address, user_account_id, created_at, linked_at
           FROM community_waitlist
           ORDER BY created_at DESC LIMIT 100"
        );
      }
      if (!$stmt || !$stmt->execute()) {
        throw new RuntimeException($mysqli->error);
      }
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static function (array $row): array {
        return [
          "id" => (int)$row["id"],
          "email" => $row["email"],
          "source" => $row["source"],
          "walletAddress" => $row["wallet_address"],
          "userAccountId" => $row["user_account_id"] !== null ? (int)$row["user_account_id"] : null,
          "createdAt" => toIso($row["created_at"]),
          "linkedAt" => toIso($row["linked_at"]),
        ];
      }, $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.holders":
      $sql = "SELECT wp.address, ua.email, ua.display_name, wp.first_gaine_balance, wp.last_gaine_balance,
                     wp.first_verified_at, wp.last_verified_at, ua.holder_status
              FROM wallet_profiles wp
              LEFT JOIN user_accounts ua ON wp.user_account_id = ua.id
              WHERE CAST(wp.last_gaine_balance AS DECIMAL(24,8)) > 0
              ORDER BY wp.last_verified_at DESC
              LIMIT 100";
      $result = $mysqli->query($sql);
      if (!$result) {
        throw new RuntimeException($mysqli->error);
      }
      $rows = $result->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static function (array $row): array {
        return [
          "address" => $row["address"],
          "email" => $row["email"],
          "displayName" => $row["display_name"],
          "firstGaineBalance" => $row["first_gaine_balance"],
          "lastGaineBalance" => $row["last_gaine_balance"],
          "firstVerifiedAt" => toIso($row["first_verified_at"]),
          "lastVerifiedAt" => toIso($row["last_verified_at"]),
          "holderStatus" => $row["holder_status"],
        ];
      }, $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.applications":
      $search = trim((string)($body["search"] ?? ""));
      $baseSql = "SELECT na.id, na.organization_name, na.email, na.country, tt.label AS partner_type,
                         na.credentials, na.gabon_first_sourcing, na.southeast_africa, na.solana_wallet, na.status, na.created_at
                  FROM network_applications na
                  INNER JOIN taxonomy_terms tt ON na.partner_type_id = tt.id";
      if ($search !== "") {
        $stmt = $mysqli->prepare(
          $baseSql . " WHERE na.email LIKE CONCAT('%', ?, '%')
                          OR na.organization_name LIKE CONCAT('%', ?, '%')
                          OR na.country LIKE CONCAT('%', ?, '%')
                        ORDER BY na.created_at DESC LIMIT 100"
        );
        $stmt->bind_param("sss", $search, $search, $search);
      } else {
        $stmt = $mysqli->prepare($baseSql . " ORDER BY na.created_at DESC LIMIT 100");
      }
      if (!$stmt || !$stmt->execute()) {
        throw new RuntimeException($mysqli->error);
      }
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static function (array $row): array {
        return [
          "id" => (int)$row["id"],
          "organizationName" => $row["organization_name"],
          "email" => $row["email"],
          "country" => $row["country"],
          "partnerType" => $row["partner_type"],
          "credentials" => $row["credentials"],
          "gabonFirstSourcing" => (bool)$row["gabon_first_sourcing"],
          "southeastAfrica" => (bool)$row["southeast_africa"],
          "solanaWallet" => $row["solana_wallet"],
          "status" => $row["status"],
          "createdAt" => toIso($row["created_at"]),
        ];
      }, $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.deleteApplication":
      $id = (int)($body["id"] ?? 0);
      if ($id <= 0) {
        respond(400, ["ok" => false, "error" => "Invalid id"]);
      }
      $stmt = $mysqli->prepare("DELETE FROM network_applications WHERE id = ?");
      if (!$stmt) {
        throw new RuntimeException($mysqli->error);
      }
      $stmt->bind_param("i", $id);
      if (!$stmt->execute()) {
        throw new RuntimeException($mysqli->error);
      }
      respond(200, ["ok" => true, "data" => ["ok" => true]]);

    case "admin.reflections":
      $sql = "SELECT wp.address AS wallet_address, ua.email, ua.display_name, wp.last_gaine_balance,
                     tt.label AS direction_label, tt.slug AS direction_slug,
                     ip.name AS project_name, ip.slug AS project_slug, ua.reflection_updated_at
              FROM user_accounts ua
              LEFT JOIN wallet_profiles wp ON ua.primary_wallet_id = wp.id
              LEFT JOIN taxonomy_terms tt ON ua.reflection_direction_id = tt.id
              LEFT JOIN impact_projects ip ON ua.reflection_project_id = ip.id
              WHERE ua.reflection_direction_id IS NOT NULL
              ORDER BY ua.reflection_updated_at DESC
              LIMIT 200";
      $result = $mysqli->query($sql);
      if (!$result) {
        throw new RuntimeException($mysqli->error);
      }
      $rows = $result->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static function (array $row): array {
        return [
          "walletAddress" => $row["wallet_address"],
          "email" => $row["email"],
          "displayName" => $row["display_name"],
          "lastGaineBalance" => $row["last_gaine_balance"],
          "directionLabel" => $row["direction_label"],
          "directionSlug" => $row["direction_slug"],
          "projectName" => $row["project_name"],
          "projectSlug" => $row["project_slug"],
          "reflectionUpdatedAt" => toIso($row["reflection_updated_at"]),
        ];
      }, $rows);
      respond(200, ["ok" => true, "data" => $data]);

    default:
      respond(400, ["ok" => false, "error" => "Unknown action"]);
  }
} catch (Throwable $error) {
  respond(500, ["ok" => false, "error" => $error->getMessage()]);
} finally {
  $mysqli->close();
}
