# GAINE Reflection Sender Integration

Hand-off for the **sender repo**: pull holder destinations from ibogarden, send **GAINE** on Solana, then register each confirmed send back here.

ibogarden-sketch does **not** send transactions. It stores preferences + disbursement ledgers and exposes authenticated APIs.

---

## GAINE token (short)

| | |
|---|---|
| Mint | `ibozy4AxS6TdsBDerGJN1ZKFFohEubFdHWGcyLxPLFL` |
| Program | Token-2022 |
| Decimals | `6` |
| Supply | `999,369` |
| Transfer fee | `2%` |
| Reflect in | **GAINE** (never convert reflections to USDC) |
| Jupiter | https://jup.ag/tokens/ibozy4AxS6TdsBDerGJN1ZKFFohEubFdHWGcyLxPLFL |
| Metadata | https://raw.githubusercontent.com/dougbutner/Bridged-EASY-Contracts/refs/heads/main/metadata-gaine-main.json |

```
human_gaine = raw_base_units / 1_000_000
```

Project liquidity wallet (Orca): `GAinSTufAma6Z53W1EveJPYSXh2bJySw4k2kZ1TMoLF3`

---

## Explicit 2% fee split (sender must follow)

Of every GAINE transfer fee:

| Share | Destination wallet | Notes |
|---|---|---|
| **25%** | `AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ` | Gabon farm operations |
| **25%** | `AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ` | Market making / liquidity pairing |
| **50%** | Holder-directed via routing API | Default fund wallet below; holders with ≥100 GAINE can override |

Default / most registered-category beneficiary:

- `RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u`

Exception — category `tech_innovation` routes the holder’s **50% share** to:

- `AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ`

`unregistered_project` → use the holder’s `destinationWallet` from the routing API (custom Solana address).

**v1:** Do **not** POST disbursements for the two fixed 25% legs or for `balanced` leave-in-pool shares. Only POST when you actually send a holder’s **50%** share to a resolved `destinationWallet`.

Holder eligibility to choose a direction: **≥ 100 GAINE**.

---

## Auth (both APIs)

```
Authorization: Bearer <REFLECTION_API_KEY>
```

or

```
x-reflection-api-key: <REFLECTION_API_KEY>
```

Env: Cloudflare Worker secret `REFLECTION_API_KEY` (see `.env.example`).

---

## 1. GET `/api/reflection/routing` — who gets what

Fetch holders (≥100 GAINE in DB) and their beneficiary mapping before each distribution batch.

```bash
curl -sS "https://ibo.garden/api/reflection/routing" \
  -H "Authorization: Bearer $REFLECTION_API_KEY"
```

### Response

```json
{
  "categories": [
    {
      "slug": "tech_innovation",
      "label": "Tech Innovation",
      "description": "...",
      "solanaWallet": "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ"
    }
  ],
  "projects": [],
  "routing": [
    {
      "userAccountId": 42,
      "reflectionDirectionId": 7,
      "holderWallet": "HolderSolanaAddress...",
      "gaineBalance": "1000.00000000",
      "destinationType": "category",
      "destinationSlug": "tech_innovation",
      "destinationWallet": "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
      "customTitle": null,
      "updatedAt": "2026-07-08T12:00:00.000Z"
    }
  ]
}
```

### `routing[]` fields

| Field | Meaning |
|---|---|
| `userAccountId` | Holder account id |
| `reflectionDirectionId` | Taxonomy term id for the fund option (`null` if balanced / no preference) |
| `holderWallet` | Holder Solana address |
| `gaineBalance` | Cached balance (last wallet verify) |
| `destinationType` | `"category"` \| `"unregistered"` \| `"balanced"` |
| `destinationSlug` | Category slug; `null` when balanced |
| `destinationWallet` | Where to send the holder’s 50% GAINE share; `null` when balanced |
| `customTitle` | Set when `unregistered`; otherwise `null` |
| `updatedAt` | Last preference save |

### `destinationType`

| Type | Action for the 50% holder share |
|---|---|
| `category` | Send GAINE to `destinationWallet` |
| `unregistered` | Send GAINE to `destinationWallet`; keep `customTitle` for logs |
| `balanced` | No saved preference — apply sender default policy; **do not POST** a disbursement in v1 |

Always prefer `reflectionDirectionId` from this payload when recording sends (do not guess ids).

---

## 2. POST `/api/reflection/disbursements` — register a successful send

Call **once per confirmed on-chain GAINE transfer** of a holder’s directed share.

```bash
curl -sS -X POST "https://ibo.garden/api/reflection/disbursements" \
  -H "Authorization: Bearer $REFLECTION_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "userAccountId": 42,
    "reflectionDirectionId": 7,
    "holderWallet": "HolderSolanaAddress...",
    "destinationWallet": "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
    "amountGaine": "12.34567800",
    "solanaTxSignature": "5xyz...",
    "customTitle": null,
    "destinationType": "category",
    "destinationSlug": "tech_innovation"
  }'
```

### Body

| Field | Required | Notes |
|---|---|---|
| `userAccountId` | yes | From routing |
| `reflectionDirectionId` | yes | From routing (never null for recorded sends) |
| `holderWallet` | yes | 32–44 chars |
| `destinationWallet` | yes | Where GAINE was sent |
| `amountGaine` | yes | Positive string or number (human units) |
| `solanaTxSignature` | yes | Unique; retries return **409** |
| `customTitle` | no | For unregistered projects |
| `destinationType` | no | `"category"` \| `"unregistered"` (logging / optional) |
| `destinationSlug` | no | Optional slug echo |

Server: inserts `reflection_disbursements`, upserts `reflection_disbursement_totals` for `(reflection_direction_id, destination_wallet)`.

One-at-a-time only (no batch endpoint in v1).

### Success

`201` + body:

```json
{ "id": 123, "createdAt": "2026-07-13T18:00:00.000Z", "duplicate": false }
```

### Status codes

| Status | Meaning |
|---|---|
| `201` | Recorded |
| `401` | Bad / missing API key |
| `409` | Duplicate `solanaTxSignature` (safe to retry / ignore) |
| `422` | Validation error |
| `503` | `REFLECTION_API_KEY` not configured |

---

## Recommended sender algorithm

1. Collect the 2% fee GAINE for the batch.
2. Split explicitly:
   - **25% + 25%** → send to `AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ` (farm + market making). No POST to ibogarden for these.
   - **50%** → holder-directed pool.
3. `GET /api/reflection/routing`.
4. For each holder share of the 50%:
   - If `destinationWallet` set → transfer GAINE there → `POST /api/reflection/disbursements` with that tx + `reflectionDirectionId`.
   - If `destinationType === "balanced"` → apply your default (v1: no POST).
5. On `409`, treat as already recorded.
6. Use `updatedAt` / re-poll when preferences may have changed.

---

## Ledgers (DB)

| Table | Role |
|---|---|
| `reflection_disbursements` | One row per confirmed holder send (`amount_gaine`, `solana_tx_signature` unique) |
| `reflection_disbursement_totals` | Totals per `(reflection_direction_id, destination_wallet)` |

---

## Repo split

| ibogarden-sketch | Sender repo |
|---|---|
| Preferences + routing GET | Fee collection + GAINE transfers |
| Disbursement POST + totals | Computes amount per holder |
| API key gating | Calls GET then POST after confirm |

## Tests

`tests/reflection.test.ts` — preference save, routing (`reflectionDirectionId`), disbursement insert / duplicate 409.

```bash
npm test
```
