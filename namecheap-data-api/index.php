<?php
declare(strict_types=1);

const DB_HOST = "127.0.0.1";
const DB_PORT = 3306;
const DB_NAME = "your_cpanel_database_name";
const DB_USER = "your_cpanel_database_user";
const DB_PASSWORD = "your_database_password";
const ADMIN_DATA_API_SECRET = "replace_with_long_random_secret";
const REFLECTION_MIN_BALANCE = 100;

header("Content-Type: application/json; charset=utf-8");

function respond(int $status, array $payload): never {
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function toIso(?string $value): ?string {
  return $value !== null && $value !== "" ? str_replace(" ", "T", $value) . "Z" : null;
}

function normEmail(string $email): string {
  return strtolower(trim($email));
}

function getTermId(mysqli $db, string $domainSlug, string $termSlug): ?int {
  $stmt = $db->prepare(
    "SELECT tt.id FROM taxonomy_terms tt
     INNER JOIN taxonomy_domains td ON tt.domain_id = td.id
     WHERE td.slug = ? AND tt.slug = ? LIMIT 1"
  );
  $stmt->bind_param("ss", $domainSlug, $termSlug);
  if (!$stmt->execute()) return null;
  $row = $stmt->get_result()->fetch_assoc();
  return $row ? (int)$row["id"] : null;
}

function linkWaitlist(mysqli $db, string $email, int $userAccountId, ?string $walletAddress = null): void {
  $normalized = normEmail($email);
  $stmt = $db->prepare(
    "UPDATE community_waitlist SET user_account_id = ?, wallet_address = ?, linked_at = NOW()
     WHERE email = ?"
  );
  $stmt->bind_param("iss", $userAccountId, $walletAddress, $normalized);
  $stmt->execute();
}

function refreshJourneyStats(mysqli $db, int $userAccountId, array $input): void {
  $eventType = (string)($input["eventType"] ?? "");
  $balance = $input["gaineBalanceSnapshot"] ?? null;
  $balanceStr = $balance !== null ? (string)$balance : null;

  $stmt = $db->prepare("SELECT * FROM user_journey_stats WHERE user_account_id = ? LIMIT 1");
  $stmt->bind_param("i", $userAccountId);
  $stmt->execute();
  $existing = $stmt->get_result()->fetch_assoc();

  if (!$existing) {
    $pageViews = $eventType === "page_view" ? 1 : 0;
    $articles = $eventType === "article_click" ? 1 : 0;
    $listings = $eventType === "listing_view" ? 1 : 0;
    $inquiries = $eventType === "listing_inquiry" ? 1 : 0;
    $shares = $eventType === "share_copy" ? 1 : 0;
    $stmt = $db->prepare(
      "INSERT INTO user_journey_stats
       (user_account_id, first_seen_at, last_event_at, total_page_views, learn_articles_read,
        listings_viewed, listings_inquired, share_actions, gaine_current_balance, journey_stage)
       VALUES (?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, 'registered')"
    );
    $stmt->bind_param("iiiiiis", $userAccountId, $pageViews, $articles, $listings, $inquiries, $shares, $balanceStr);
    $stmt->execute();
    return;
  }

  $pageViews = (int)$existing["total_page_views"] + ($eventType === "page_view" ? 1 : 0);
  $articles = (int)$existing["learn_articles_read"] + ($eventType === "article_click" ? 1 : 0);
  $listings = (int)$existing["listings_viewed"] + ($eventType === "listing_view" ? 1 : 0);
  $inquiries = (int)$existing["listings_inquired"] + ($eventType === "listing_inquiry" ? 1 : 0);
  $shares = (int)$existing["share_actions"] + ($eventType === "share_copy" ? 1 : 0);
  $currentBalance = $balanceStr ?? $existing["gaine_current_balance"];

  $stmt = $db->prepare(
    "UPDATE user_journey_stats SET last_event_at = NOW(), total_page_views = ?, learn_articles_read = ?,
     listings_viewed = ?, listings_inquired = ?, share_actions = ?, gaine_current_balance = ?
     WHERE user_account_id = ?"
  );
  $stmt->bind_param("iiiiisi", $pageViews, $articles, $listings, $inquiries, $shares, $currentBalance, $userAccountId);
  $stmt->execute();
}

function trackEvent(mysqli $db, array $input): void {
  $meta = $input["metadata"] ?? null;
  $metaJson = $meta !== null ? json_encode($meta) : null;
  $userAccountId = isset($input["userAccountId"]) ? (int)$input["userAccountId"] : null;
  $balance = $input["gaineBalanceSnapshot"] ?? null;
  $balanceStr = $balance !== null ? (string)$balance : null;

  $stmt = $db->prepare(
    "INSERT INTO user_events
     (user_account_id, anonymous_session_id, session_id, event_type, event_category, path, referrer,
      utm_source, utm_medium, utm_campaign, ref_code, entity_type, entity_id, metadata, wallet_address, gaine_balance_snapshot)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  $anon = $input["anonymousSessionId"] ?? null;
  $sessionId = $input["sessionId"] ?? null;
  $eventType = (string)($input["eventType"] ?? "");
  $eventCategory = (string)($input["eventCategory"] ?? "");
  $path = $input["path"] ?? null;
  $referrer = $input["referrer"] ?? null;
  $utmSource = $input["utmSource"] ?? null;
  $utmMedium = $input["utmMedium"] ?? null;
  $utmCampaign = $input["utmCampaign"] ?? null;
  $refCode = $input["refCode"] ?? null;
  $entityType = $input["entityType"] ?? null;
  $entityId = isset($input["entityId"]) ? (int)$input["entityId"] : null;
  $walletAddress = $input["walletAddress"] ?? null;
  $stmt->bind_param(
    "isssssssssssisss",
    $userAccountId,
    $anon,
    $sessionId,
    $eventType,
    $eventCategory,
    $path,
    $referrer,
    $utmSource,
    $utmMedium,
    $utmCampaign,
    $refCode,
    $entityType,
    $entityId,
    $metaJson,
    $walletAddress,
    $balanceStr
  );
  $stmt->execute();

  if ($userAccountId) {
    refreshJourneyStats($db, $userAccountId, $input);
  }
}

if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== "POST") {
  respond(405, ["ok" => false, "error" => "Method not allowed"]);
}

$secret = $_SERVER["HTTP_X_ADMIN_SECRET"] ?? "";
if (!is_string($secret) || ADMIN_DATA_API_SECRET === "replace_with_long_random_secret" || !hash_equals(ADMIN_DATA_API_SECRET, $secret)) {
  respond(401, ["ok" => false, "error" => "Unauthorized"]);
}

$body = json_decode(file_get_contents("php://input") ?: "{}", true);
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
      $row = $result ? $result->fetch_assoc() : ["taxonomy_terms" => 0];
      respond(200, ["ok" => true, "data" => ["connected" => true, "taxonomyTerms" => (int)$row["taxonomy_terms"]]]);

    case "waitlist.join":
      $email = normEmail((string)($body["email"] ?? ""));
      $source = trim((string)($body["source"] ?? "community_page")) ?: "community_page";
      $stmt = $mysqli->prepare("SELECT id FROM community_waitlist WHERE email = ? LIMIT 1");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $existing = $stmt->get_result()->fetch_assoc();
      if ($existing) {
        respond(200, ["ok" => true, "data" => ["ok" => true, "alreadyExists" => true, "id" => (int)$existing["id"]]]);
      }
      $stmt = $mysqli->prepare("INSERT INTO community_waitlist (email, source) VALUES (?, ?)");
      $stmt->bind_param("ss", $email, $source);
      $stmt->execute();
      respond(200, ["ok" => true, "data" => ["ok" => true, "alreadyExists" => false, "id" => (int)$mysqli->insert_id]]);

    case "waitlist.link":
      linkWaitlist($mysqli, (string)($body["email"] ?? ""), (int)($body["userAccountId"] ?? 0), $body["walletAddress"] ?? null);
      respond(200, ["ok" => true, "data" => ["ok" => true]]);

    case "journey.track":
      trackEvent($mysqli, $body);
      respond(200, ["ok" => true, "data" => ["ok" => true]]);

    case "taxonomy.termId":
      $id = getTermId($mysqli, (string)($body["domainSlug"] ?? ""), (string)($body["termSlug"] ?? ""));
      respond(200, ["ok" => true, "data" => $id]);

    case "taxonomy.list":
      $domainSlug = (string)($body["domainSlug"] ?? "");
      $stmt = $mysqli->prepare(
        "SELECT tt.id, tt.slug, tt.label, tt.sort_order FROM taxonomy_terms tt
         INNER JOIN taxonomy_domains td ON tt.domain_id = td.id
         WHERE td.slug = ? AND tt.is_active = 1 ORDER BY tt.sort_order"
      );
      $stmt->bind_param("s", $domainSlug);
      $stmt->execute();
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static fn(array $r): array => [
        "id" => (int)$r["id"],
        "slug" => $r["slug"],
        "label" => $r["label"],
        "sortOrder" => (int)$r["sort_order"],
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "community.list":
      $limit = max(1, min(100, (int)($body["limit"] ?? 50)));
      $sql = "SELECT cm.id, cm.body, cm.created_at, cm.user_account_id, ua.display_name, ua.email
              FROM community_messages cm
              INNER JOIN user_accounts ua ON cm.user_account_id = ua.id
              WHERE cm.deleted_at IS NULL
              ORDER BY cm.created_at DESC LIMIT ?";
      $stmt = $mysqli->prepare($sql);
      $stmt->bind_param("i", $limit);
      $stmt->execute();
      $rows = array_reverse($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
      $data = array_map(static fn(array $r): array => [
        "id" => (int)$r["id"],
        "body" => $r["body"],
        "createdAt" => toIso($r["created_at"]),
        "userAccountId" => (int)$r["user_account_id"],
        "displayName" => $r["display_name"],
        "email" => $r["email"],
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "community.post":
      $userAccountId = (int)($body["userAccountId"] ?? 0);
      $text = trim((string)($body["body"] ?? ""));
      if ($text === "") respond(400, ["ok" => false, "error" => "Message is required"]);
      $stmt = $mysqli->prepare("SELECT holder_status FROM user_accounts WHERE id = ? LIMIT 1");
      $stmt->bind_param("i", $userAccountId);
      $stmt->execute();
      $user = $stmt->get_result()->fetch_assoc();
      if (!$user || $user["holder_status"] !== "active") respond(403, ["ok" => false, "error" => "Holder access required"]);
      $stmt = $mysqli->prepare("INSERT INTO community_messages (user_account_id, body) VALUES (?, ?)");
      $stmt->bind_param("is", $userAccountId, $text);
      $stmt->execute();
      $messageId = (int)$mysqli->insert_id;
      trackEvent($mysqli, [
        "userAccountId" => $userAccountId,
        "eventType" => "community_message",
        "eventCategory" => "community",
        "entityType" => "community_message",
        "entityId" => $messageId,
      ]);
      respond(200, ["ok" => true, "data" => ["id" => $messageId]]);

    case "network.submit":
      $partnerTypeId = getTermId($mysqli, "partner_type", (string)($body["partnerTypeSlug"] ?? ""));
      if (!$partnerTypeId) respond(400, ["ok" => false, "error" => "Invalid partner type"]);
      $org = trim((string)($body["organizationName"] ?? ""));
      $email = normEmail((string)($body["email"] ?? ""));
      $country = trim((string)($body["country"] ?? ""));
      $credentials = trim((string)($body["credentials"] ?? "")) ?: null;
      $gabon = !empty($body["gabonFirstSourcing"]) ? 1 : 0;
      $southeast = !empty($body["southeastAfrica"]) ? 1 : 0;
      $wallet = trim((string)($body["solanaWallet"] ?? "")) ?: null;
      $stmt = $mysqli->prepare(
        "INSERT INTO network_applications
         (organization_name, email, country, partner_type_id, credentials, gabon_first_sourcing, southeast_africa, solana_wallet, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
      );
      $stmt->bind_param("sssiisss", $org, $email, $country, $partnerTypeId, $credentials, $gabon, $southeast, $wallet);
      $stmt->execute();
      $applicationId = (int)$mysqli->insert_id;
      trackEvent($mysqli, [
        "eventType" => "network_application_submit",
        "eventCategory" => "network",
        "entityType" => "network_application",
        "entityId" => $applicationId,
        "metadata" => ["partnerType" => $body["partnerTypeSlug"] ?? null, "country" => $country],
      ]);
      respond(200, ["ok" => true, "data" => ["ok" => true, "id" => $applicationId]]);

    case "holder.getUser":
      $userId = (int)($body["userId"] ?? 0);
      $stmt = $mysqli->prepare("SELECT * FROM user_accounts WHERE id = ? LIMIT 1");
      $stmt->bind_param("i", $userId);
      $stmt->execute();
      $user = $stmt->get_result()->fetch_assoc();
      if (!$user) respond(200, ["ok" => true, "data" => null]);
      respond(200, ["ok" => true, "data" => [
        "id" => (int)$user["id"],
        "email" => $user["email"],
        "displayName" => $user["display_name"],
        "avatarUrl" => $user["avatar_url"],
        "primaryWalletId" => $user["primary_wallet_id"] !== null ? (int)$user["primary_wallet_id"] : null,
        "holderStatus" => $user["holder_status"],
        "reflectionDirectionId" => $user["reflection_direction_id"] !== null ? (int)$user["reflection_direction_id"] : null,
        "reflectionProjectId" => $user["reflection_project_id"] !== null ? (int)$user["reflection_project_id"] : null,
        "reflectionUpdatedAt" => toIso($user["reflection_updated_at"]),
        "createdAt" => toIso($user["created_at"]),
        "lastSeenAt" => toIso($user["last_seen_at"]),
        "lastLoginAt" => toIso($user["last_login_at"]),
      ]]);

    case "holder.upsertGoogle":
      $providerUserId = (string)($body["providerUserId"] ?? "");
      $email = normEmail((string)($body["email"] ?? ""));
      $displayName = (string)($body["displayName"] ?? "");
      $avatarUrl = $body["avatarUrl"] ?? null;
      $stmt = $mysqli->prepare(
        "SELECT user_account_id FROM oauth_identities WHERE provider = 'google' AND provider_user_id = ? LIMIT 1"
      );
      $stmt->bind_param("s", $providerUserId);
      $stmt->execute();
      $existingOAuth = $stmt->get_result()->fetch_assoc();
      if ($existingOAuth) {
        $userId = (int)$existingOAuth["user_account_id"];
        $stmt = $mysqli->prepare(
          "UPDATE user_accounts SET email = ?, display_name = ?, avatar_url = ?, last_login_at = NOW(), last_seen_at = NOW() WHERE id = ?"
        );
        $stmt->bind_param("sssi", $email, $displayName, $avatarUrl, $userId);
        $stmt->execute();
      } else {
        $stmt = $mysqli->prepare("SELECT id FROM user_accounts WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $byEmail = $stmt->get_result()->fetch_assoc();
        $userId = $byEmail ? (int)$byEmail["id"] : 0;
        if (!$userId) {
          $stmt = $mysqli->prepare(
            "INSERT INTO user_accounts (email, display_name, avatar_url, last_login_at, last_seen_at) VALUES (?, ?, ?, NOW(), NOW())"
          );
          $stmt->bind_param("sss", $email, $displayName, $avatarUrl);
          $stmt->execute();
          $userId = (int)$mysqli->insert_id;
          $stmt = $mysqli->prepare(
            "INSERT INTO user_journey_stats (user_account_id, first_seen_at, first_login_at, last_event_at, journey_stage)
             VALUES (?, NOW(), NOW(), NOW(), 'registered')"
          );
          $stmt->bind_param("i", $userId);
          $stmt->execute();
        } else {
          $stmt = $mysqli->prepare(
            "UPDATE user_accounts SET display_name = ?, avatar_url = ?, last_login_at = NOW(), last_seen_at = NOW() WHERE id = ?"
          );
          $stmt->bind_param("ssi", $displayName, $avatarUrl, $userId);
          $stmt->execute();
        }
        $stmt = $mysqli->prepare(
          "INSERT INTO oauth_identities (user_account_id, provider, provider_user_id) VALUES (?, 'google', ?)"
        );
        $stmt->bind_param("is", $userId, $providerUserId);
        $stmt->execute();
      }
      trackEvent($mysqli, ["userAccountId" => $userId, "eventType" => "oauth_login", "eventCategory" => "auth", "metadata" => ["provider" => "google"]]);
      linkWaitlist($mysqli, $email, $userId);
      respond(200, ["ok" => true, "data" => ["userId" => $userId, "email" => $email, "displayName" => $displayName]]);

    case "holder.verifyLogin":
      $address = trim((string)($body["address"] ?? ""));
      $balance = (float)($body["balance"] ?? 0);
      $isHolder = $balance > 0;
      $userId = isset($body["userAccountId"]) ? (int)$body["userAccountId"] : 0;
      $email = isset($body["email"]) ? normEmail((string)$body["email"]) : null;
      $walletProvider = $body["walletProvider"] ?? null;

      if (!$userId && $email) {
        $stmt = $mysqli->prepare("SELECT id FROM user_accounts WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $byEmail = $stmt->get_result()->fetch_assoc();
        if ($byEmail) $userId = (int)$byEmail["id"];
      }
      if (!$userId) {
        $stmt = $mysqli->prepare("INSERT INTO user_accounts (email, holder_status, last_login_at, last_seen_at) VALUES (?, ?, NOW(), NOW())");
        $holderStatus = $isHolder ? "active" : "none";
        $stmt->bind_param("ss", $email, $holderStatus);
        $stmt->execute();
        $userId = (int)$mysqli->insert_id;
      }

      $stmt = $mysqli->prepare("SELECT * FROM wallet_profiles WHERE address = ? LIMIT 1");
      $stmt->bind_param("s", $address);
      $stmt->execute();
      $existingWallet = $stmt->get_result()->fetch_assoc();
      $balanceStr = (string)$balance;

      if ($existingWallet) {
        $peak = max((float)($existingWallet["peak_gaine_balance"] ?? 0), $balance, (float)($existingWallet["last_gaine_balance"] ?? 0));
        $firstBalance = $existingWallet["first_gaine_balance"] ?? ($isHolder ? $balanceStr : null);
        $firstVerified = $existingWallet["first_verified_at"] ?? ($isHolder ? date("Y-m-d H:i:s") : null);
        $lastVerified = $isHolder ? date("Y-m-d H:i:s") : $existingWallet["last_verified_at"];
        $stmt = $mysqli->prepare(
          "UPDATE wallet_profiles SET user_account_id = ?, wallet_provider = ?, last_gaine_balance = ?,
           peak_gaine_balance = ?, last_verified_at = ?, first_gaine_balance = ?, first_verified_at = ? WHERE id = ?"
        );
        $walletId = (int)$existingWallet["id"];
        $provider = $walletProvider ?? $existingWallet["wallet_provider"];
        $peakStr = (string)$peak;
        $stmt->bind_param("issssssi", $userId, $provider, $balanceStr, $peakStr, $lastVerified, $firstBalance, $firstVerified, $walletId);
        $stmt->execute();
      } else {
        $stmt = $mysqli->prepare(
          "INSERT INTO wallet_profiles (address, user_account_id, wallet_provider, first_gaine_balance, peak_gaine_balance,
           last_gaine_balance, first_verified_at, last_verified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $firstBal = $isHolder ? $balanceStr : null;
        $peakBal = $isHolder ? $balanceStr : null;
        $firstVer = $isHolder ? date("Y-m-d H:i:s") : null;
        $lastVer = $isHolder ? date("Y-m-d H:i:s") : null;
        $stmt->bind_param("sissssss", $address, $userId, $walletProvider, $firstBal, $peakBal, $balanceStr, $firstVer, $lastVer);
        $stmt->execute();
      }

      $stmt = $mysqli->prepare("SELECT id FROM wallet_profiles WHERE address = ? LIMIT 1");
      $stmt->bind_param("s", $address);
      $stmt->execute();
      $wallet = $stmt->get_result()->fetch_assoc();
      $walletId = $wallet ? (int)$wallet["id"] : null;
      $holderStatus = $isHolder ? "active" : "none";
      if ($email) {
        $stmt = $mysqli->prepare(
          "UPDATE user_accounts SET primary_wallet_id = ?, holder_status = ?, email = ?, last_login_at = NOW(), last_seen_at = NOW() WHERE id = ?"
        );
        $stmt->bind_param("issi", $walletId, $holderStatus, $email, $userId);
      } else {
        $stmt = $mysqli->prepare(
          "UPDATE user_accounts SET primary_wallet_id = ?, holder_status = ?, last_login_at = NOW(), last_seen_at = NOW() WHERE id = ?"
        );
        $stmt->bind_param("isi", $walletId, $holderStatus, $userId);
      }
      $stmt->execute();

      if ($isHolder) {
        $stmt = $mysqli->prepare("SELECT id FROM community_memberships WHERE user_account_id = ? LIMIT 1");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        if (!$stmt->get_result()->fetch_assoc()) {
          $stmt = $mysqli->prepare("INSERT INTO community_memberships (user_account_id) VALUES (?)");
          $stmt->bind_param("i", $userId);
          $stmt->execute();
        }
        $stmt = $mysqli->prepare("SELECT * FROM user_journey_stats WHERE user_account_id = ? LIMIT 1");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stats = $stmt->get_result()->fetch_assoc();
        if (!$stats) {
          $stmt = $mysqli->prepare(
            "INSERT INTO user_journey_stats (user_account_id, first_seen_at, first_login_at, first_holder_at, last_event_at,
             gaine_peak_balance, gaine_current_balance, journey_stage) VALUES (?, NOW(), NOW(), NOW(), NOW(), ?, ?, 'holder')"
          );
          $stmt->bind_param("iss", $userId, $balanceStr, $balanceStr);
          $stmt->execute();
        } else {
          $peak = max((float)($stats["gaine_peak_balance"] ?? 0), $balance);
          $peakStr = (string)$peak;
          $stmt = $mysqli->prepare(
            "UPDATE user_journey_stats SET first_holder_at = COALESCE(first_holder_at, NOW()), gaine_peak_balance = ?,
             gaine_current_balance = ?, journey_stage = 'holder', last_event_at = NOW() WHERE user_account_id = ?"
          );
          $stmt->bind_param("ssi", $peakStr, $balanceStr, $userId);
          $stmt->execute();
        }
      }

      if ($email) linkWaitlist($mysqli, $email, $userId, $address);
      trackEvent($mysqli, [
        "userAccountId" => $userId,
        "eventType" => $isHolder ? "gaine_verify_pass" : "gaine_verify_fail",
        "eventCategory" => "auth",
        "walletAddress" => $address,
        "gaineBalanceSnapshot" => $balance,
      ]);

      $stmt = $mysqli->prepare("SELECT email, display_name FROM user_accounts WHERE id = ? LIMIT 1");
      $stmt->bind_param("i", $userId);
      $stmt->execute();
      $user = $stmt->get_result()->fetch_assoc();
      respond(200, ["ok" => true, "data" => [
        "userId" => $userId,
        "isHolder" => $isHolder,
        "balance" => $balance,
        "email" => $user["email"] ?? null,
        "displayName" => $user["display_name"] ?? null,
      ]]);

    case "reflection.categories":
      $result = $mysqli->query(
        "SELECT tt.slug, tt.label, tt.metadata, tt.sort_order FROM taxonomy_terms tt
         INNER JOIN taxonomy_domains td ON tt.domain_id = td.id
         WHERE td.slug = 'reflection_direction' AND tt.is_active = 1 ORDER BY tt.sort_order"
      );
      $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
      $data = array_map(static function (array $r): array {
        $meta = $r["metadata"];
        if (is_string($meta)) $meta = json_decode($meta, true);
        return ["slug" => $r["slug"], "label" => $r["label"], "metadata" => $meta, "sortOrder" => (int)$r["sort_order"]];
      }, $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "reflection.projects":
      $result = $mysqli->query(
        "SELECT slug, name, description, solana_wallet FROM impact_projects WHERE is_active = 1 ORDER BY sort_order"
      );
      $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
      $data = array_map(static fn(array $r): array => [
        "slug" => $r["slug"],
        "name" => $r["name"],
        "description" => $r["description"],
        "solanaWallet" => $r["solana_wallet"],
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "reflection.getPreference":
      $userId = (int)($body["userId"] ?? 0);
      $stmt = $mysqli->prepare(
        "SELECT tt.slug AS direction_slug, tt.label AS direction_label, ip.slug AS project_slug, ip.name AS project_name,
                ua.reflection_updated_at FROM user_accounts ua
         LEFT JOIN taxonomy_terms tt ON ua.reflection_direction_id = tt.id
         LEFT JOIN impact_projects ip ON ua.reflection_project_id = ip.id
         WHERE ua.id = ? LIMIT 1"
      );
      $stmt->bind_param("i", $userId);
      $stmt->execute();
      $row = $stmt->get_result()->fetch_assoc();
      respond(200, ["ok" => true, "data" => [
        "directionSlug" => $row["direction_slug"] ?? null,
        "directionLabel" => $row["direction_label"] ?? null,
        "projectSlug" => $row["project_slug"] ?? null,
        "projectName" => $row["project_name"] ?? null,
        "updatedAt" => toIso($row["reflection_updated_at"] ?? null),
      ]]);

    case "reflection.save":
      $userId = (int)($body["userId"] ?? 0);
      $walletAddress = trim((string)($body["walletAddress"] ?? ""));
      $directionSlug = (string)($body["directionSlug"] ?? "");
      $projectSlug = $body["projectSlug"] ?? null;
      $balance = (float)($body["balance"] ?? 0);
      if ($balance < REFLECTION_MIN_BALANCE) respond(400, ["ok" => false, "error" => "Insufficient GAINE balance"]);

      $stmt = $mysqli->prepare("SELECT user_account_id FROM wallet_profiles WHERE address = ? LIMIT 1");
      $stmt->bind_param("s", $walletAddress);
      $stmt->execute();
      $wallet = $stmt->get_result()->fetch_assoc();
      if ((int)($wallet["user_account_id"] ?? 0) !== $userId) {
        respond(403, ["ok" => false, "error" => "Connected wallet does not match your account."]);
      }

      $directionId = getTermId($mysqli, "reflection_direction", $directionSlug);
      if (!$directionId) respond(400, ["ok" => false, "error" => "Unknown reflection category."]);

      $projectId = null;
      if ($directionSlug === "specific_project") {
        if (!$projectSlug) respond(400, ["ok" => false, "error" => "Choose a project to direct rewards."]);
        $stmt = $mysqli->prepare("SELECT id FROM impact_projects WHERE slug = ? AND is_active = 1 LIMIT 1");
        $stmt->bind_param("s", $projectSlug);
        $stmt->execute();
        $project = $stmt->get_result()->fetch_assoc();
        if (!$project) respond(400, ["ok" => false, "error" => "Unknown impact project."]);
        $projectId = (int)$project["id"];
      }

      $stmt = $mysqli->prepare(
        "UPDATE user_accounts SET reflection_direction_id = ?, reflection_project_id = ?, reflection_updated_at = NOW() WHERE id = ?"
      );
      $stmt->bind_param("iii", $directionId, $projectId, $userId);
      $stmt->execute();

      trackEvent($mysqli, [
        "userAccountId" => $userId,
        "eventType" => "reflection_save",
        "eventCategory" => "gaine",
        "walletAddress" => $walletAddress,
        "gaineBalanceSnapshot" => $balance,
        "metadata" => ["directionSlug" => $directionSlug, "projectSlug" => $projectSlug],
      ]);

      $stmt = $mysqli->prepare(
        "SELECT tt.slug AS direction_slug, tt.label AS direction_label, ip.slug AS project_slug, ip.name AS project_name,
                ua.reflection_updated_at FROM user_accounts ua
         LEFT JOIN taxonomy_terms tt ON ua.reflection_direction_id = tt.id
         LEFT JOIN impact_projects ip ON ua.reflection_project_id = ip.id
         WHERE ua.id = ? LIMIT 1"
      );
      $stmt->bind_param("i", $userId);
      $stmt->execute();
      $row = $stmt->get_result()->fetch_assoc();
      respond(200, ["ok" => true, "data" => [
        "directionSlug" => $row["direction_slug"] ?? null,
        "directionLabel" => $row["direction_label"] ?? null,
        "projectSlug" => $row["project_slug"] ?? null,
        "projectName" => $row["project_name"] ?? null,
        "updatedAt" => toIso($row["reflection_updated_at"] ?? null),
      ]]);

    case "reflection.routing":
      $result = $mysqli->query(
        "SELECT ua.id AS user_account_id, wp.address AS holder_wallet, tt.slug AS direction_slug,
                ip.slug AS project_slug, wp.last_gaine_balance, ua.reflection_updated_at
         FROM wallet_profiles wp
         INNER JOIN user_accounts ua ON wp.user_account_id = ua.id
         LEFT JOIN taxonomy_terms tt ON ua.reflection_direction_id = tt.id
         LEFT JOIN impact_projects ip ON ua.reflection_project_id = ip.id
         WHERE CAST(wp.last_gaine_balance AS DECIMAL(24,8)) >= " . REFLECTION_MIN_BALANCE . "
         ORDER BY ua.reflection_updated_at DESC"
      );
      $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
      $data = array_map(static fn(array $r): array => [
        "userAccountId" => (int)$r["user_account_id"],
        "holderWallet" => $r["holder_wallet"],
        "directionSlug" => $r["direction_slug"],
        "projectSlug" => $r["project_slug"],
        "lastGaineBalance" => $r["last_gaine_balance"],
        "reflectionUpdatedAt" => toIso($r["reflection_updated_at"]),
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.waitlist":
      $search = trim((string)($body["search"] ?? ""));
      $limit = max(1, min(500, (int)($body["limit"] ?? 100)));
      if ($search !== "") {
        $stmt = $mysqli->prepare(
          "SELECT id, email, source, wallet_address, user_account_id, created_at, linked_at
           FROM community_waitlist WHERE email LIKE CONCAT('%', ?, '%') OR source LIKE CONCAT('%', ?, '%')
           ORDER BY created_at DESC LIMIT ?"
        );
        $stmt->bind_param("ssi", $search, $search, $limit);
      } else {
        $stmt = $mysqli->prepare(
          "SELECT id, email, source, wallet_address, user_account_id, created_at, linked_at
           FROM community_waitlist ORDER BY created_at DESC LIMIT ?"
        );
        $stmt->bind_param("i", $limit);
      }
      $stmt->execute();
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static fn(array $r): array => [
        "id" => (int)$r["id"],
        "email" => $r["email"],
        "source" => $r["source"],
        "walletAddress" => $r["wallet_address"],
        "userAccountId" => $r["user_account_id"] !== null ? (int)$r["user_account_id"] : null,
        "createdAt" => toIso($r["created_at"]),
        "linkedAt" => toIso($r["linked_at"]),
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.holders":
      $limit = max(1, min(500, (int)($body["limit"] ?? 100)));
      $stmt = $mysqli->prepare(
        "SELECT wp.address, ua.email, ua.display_name, wp.first_gaine_balance, wp.last_gaine_balance,
                wp.first_verified_at, wp.last_verified_at, ua.holder_status
         FROM wallet_profiles wp
         LEFT JOIN user_accounts ua ON wp.user_account_id = ua.id
         WHERE CAST(wp.last_gaine_balance AS DECIMAL(24,8)) > 0
         ORDER BY wp.last_verified_at DESC LIMIT ?"
      );
      $stmt->bind_param("i", $limit);
      $stmt->execute();
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static fn(array $r): array => [
        "address" => $r["address"],
        "email" => $r["email"],
        "displayName" => $r["display_name"],
        "firstGaineBalance" => $r["first_gaine_balance"],
        "lastGaineBalance" => $r["last_gaine_balance"],
        "firstVerifiedAt" => toIso($r["first_verified_at"]),
        "lastVerifiedAt" => toIso($r["last_verified_at"]),
        "holderStatus" => $r["holder_status"],
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.applications":
      $search = trim((string)($body["search"] ?? ""));
      $limit = max(1, min(500, (int)($body["limit"] ?? 100)));
      $base = "SELECT na.id, na.organization_name, na.email, na.country, tt.label AS partner_type,
                      na.credentials, na.gabon_first_sourcing, na.southeast_africa, na.solana_wallet, na.status, na.created_at
               FROM network_applications na INNER JOIN taxonomy_terms tt ON na.partner_type_id = tt.id";
      if ($search !== "") {
        $stmt = $mysqli->prepare($base . " WHERE na.email LIKE CONCAT('%', ?, '%') OR na.organization_name LIKE CONCAT('%', ?, '%')
                                        OR na.country LIKE CONCAT('%', ?, '%') ORDER BY na.created_at DESC LIMIT ?");
        $stmt->bind_param("sssi", $search, $search, $search, $limit);
      } else {
        $stmt = $mysqli->prepare($base . " ORDER BY na.created_at DESC LIMIT ?");
        $stmt->bind_param("i", $limit);
      }
      $stmt->execute();
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static fn(array $r): array => [
        "id" => (int)$r["id"],
        "organizationName" => $r["organization_name"],
        "email" => $r["email"],
        "country" => $r["country"],
        "partnerType" => $r["partner_type"],
        "credentials" => $r["credentials"],
        "gabonFirstSourcing" => (bool)$r["gabon_first_sourcing"],
        "southeastAfrica" => (bool)$r["southeast_africa"],
        "solanaWallet" => $r["solana_wallet"],
        "status" => $r["status"],
        "createdAt" => toIso($r["created_at"]),
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    case "admin.deleteApplication":
      $id = (int)($body["id"] ?? 0);
      if ($id <= 0) respond(400, ["ok" => false, "error" => "Invalid id"]);
      $stmt = $mysqli->prepare("DELETE FROM network_applications WHERE id = ?");
      $stmt->bind_param("i", $id);
      $stmt->execute();
      respond(200, ["ok" => true, "data" => ["ok" => true]]);

    case "admin.reflections":
      $limit = max(1, min(500, (int)($body["limit"] ?? 200)));
      $stmt = $mysqli->prepare(
        "SELECT wp.address AS wallet_address, ua.email, ua.display_name, wp.last_gaine_balance,
                tt.label AS direction_label, tt.slug AS direction_slug,
                ip.name AS project_name, ip.slug AS project_slug, ua.reflection_updated_at
         FROM user_accounts ua
         LEFT JOIN wallet_profiles wp ON ua.primary_wallet_id = wp.id
         LEFT JOIN taxonomy_terms tt ON ua.reflection_direction_id = tt.id
         LEFT JOIN impact_projects ip ON ua.reflection_project_id = ip.id
         WHERE ua.reflection_direction_id IS NOT NULL
         ORDER BY ua.reflection_updated_at DESC LIMIT ?"
      );
      $stmt->bind_param("i", $limit);
      $stmt->execute();
      $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $data = array_map(static fn(array $r): array => [
        "walletAddress" => $r["wallet_address"],
        "email" => $r["email"],
        "displayName" => $r["display_name"],
        "lastGaineBalance" => $r["last_gaine_balance"],
        "directionLabel" => $r["direction_label"],
        "directionSlug" => $r["direction_slug"],
        "projectName" => $r["project_name"],
        "projectSlug" => $r["project_slug"],
        "reflectionUpdatedAt" => toIso($r["reflection_updated_at"]),
      ], $rows);
      respond(200, ["ok" => true, "data" => $data]);

    default:
      respond(400, ["ok" => false, "error" => "Unknown action"]);
  }
} catch (Throwable $error) {
  respond(500, ["ok" => false, "error" => $error->getMessage()]);
} finally {
  $mysqli->close();
}
