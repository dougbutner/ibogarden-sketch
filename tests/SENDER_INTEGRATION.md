# GAINE Reflection Sender Integration

Instructions for the **separate sender repo** that distributes USDC on Solana based on holder preferences stored in ibogarden-sketch.

This ibogarden-sketch repo **does not send transactions**. It stores holder preferences and exposes them via an authenticated read API.

## Purpose

GAINE has a 2% transfer fee. Holders with **100+ GAINE** can save a reflection direction on `/gaine` (category or specific project). The sender service reads those preferences and sends each holder's USDC share to the resolved **beneficiary Solana address**.

## API

```
GET https://ibo.garden/api/reflection/routing
Authorization: Bearer <REFLECTION_API_KEY>
```

Alternative header:

```
x-reflection-api-key: <REFLECTION_API_KEY>
```

Local dev (when running the app locally with `REFLECTION_API_KEY` set):

```
GET http://localhost:3000/api/reflection/routing
Authorization: Bearer <REFLECTION_API_KEY>
```

## Response shape

```json
{
  "categories": [
    {
      "slug": "developer_fund",
      "label": "Developer Fund",
      "description": "...",
      "solanaWallet": "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ"
    }
  ],
  "projects": [
    {
      "slug": "microdose-research",
      "name": "Microdose Research",
      "description": "...",
      "solanaWallet": "RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u"
    }
  ],
  "routing": [
    {
      "userAccountId": 42,
      "holderWallet": "HolderSolanaAddress...",
      "gaineBalance": "1000.00000000",
      "destinationType": "category",
      "destinationSlug": "developer_fund",
      "destinationWallet": "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
      "updatedAt": "2026-07-08T12:00:00.000Z"
    }
  ]
}
```

### Field reference

| Field | Meaning |
|---|---|
| `routing[]` | One row per registered holder wallet with `last_gaine_balance >= 100` in the database |
| `userAccountId` | Internal account id (for logging/correlation) |
| `holderWallet` | Solana address of the GAINE holder — map your on-chain fee attribution to this |
| `gaineBalance` | Cached balance from last wallet verify (not live on-chain) |
| `destinationType` | `"category"` \| `"project"` \| `"balanced"` |
| `destinationSlug` | Category or project slug; `null` when balanced |
| `destinationWallet` | Solana address to receive USDC when not null |
| `updatedAt` | When the holder last saved their direction; `null` if never saved |
| `categories` / `projects` | Full reference tables of valid slugs and wallets |

### `destinationType` behavior

| Type | `destinationWallet` | Sender action |
|---|---|---|
| `category` | Category's `solanaWallet` | Send holder's USDC share to that address |
| `project` | Project's `solanaWallet` | Send holder's USDC share to that address |
| `balanced` | `null` | Holder has 100+ GAINE but **no saved direction**. Sender repo decides policy (skip, treasury, default split, etc.) |

## Recommended sender algorithm

1. **Poll** `GET /api/reflection/routing` before each distribution batch (or on a schedule).
2. **Build a lookup map** from `holderWallet` → `{ destinationWallet, destinationType, updatedAt }`.
3. For each holder share you compute from on-chain fee collection:
   - Find `holderWallet` in `routing[]`.
   - If `destinationWallet` is set → transfer USDC to that address.
   - If `destinationType === "balanced"` → apply your default policy (not defined in ibogarden-sketch).
4. Use `updatedAt` to detect preference changes between runs.
5. Optionally re-verify `gaineBalance` on-chain; the API value is cached from the holder's last wallet login.

## Auth setup

1. Obtain `REFLECTION_API_KEY` from the ibogarden deploy environment (Cloudflare Worker secret).
2. Store it as a secret in the sender service. Never expose client-side.
3. Send on every request via `Authorization: Bearer` or `x-reflection-api-key`.

## Error handling

| HTTP status | Meaning |
|---|---|
| `200` | Success; `routing` may be an empty array |
| `401` | Invalid or missing API key |
| `503` | `REFLECTION_API_KEY` not configured on server |

## GAINE on-chain constants

| Constant | Value |
|---|---|
| GAINE mint | `ibozy4AxS6TdsBDerGJN1ZKFFohEubFdHWGcyLxPLFL` |
| Transfer fee | 2% |
| Reflection eligibility | 100 GAINE minimum balance |
| Token program | Token-2022 |

Source: `src/data/gaine.ts`, `src/data/reflection-destinations.ts`

## What each repo owns

| ibogarden-sketch | Sender repo |
|---|---|
| Holder saves category/project preference | Computes USDC amount per holder |
| Stores beneficiary Solana addresses in DB | Executes Solana USDC transfers |
| Resolves `destinationWallet` per holder | Collects fees / swaps GAINE → USDC |
| Filters holders with 100+ GAINE in DB | On-chain balance verification (optional) |
| Exposes read-only routing API | Balanced-holder default policy |

## Database tables (for context)

- `user_accounts.reflection_direction_id` — chosen category
- `user_accounts.reflection_project_id` — chosen project when direction is `specific_project`
- `user_accounts.reflection_updated_at` — last save timestamp
- `impact_projects.solana_wallet` — project beneficiary addresses
- `taxonomy_terms.metadata.solanaWallet` — category beneficiary addresses
- `wallet_profiles.last_gaine_balance` — cached GAINE balance

## Verification curl

```bash
curl -sS "https://ibo.garden/api/reflection/routing" \
  -H "Authorization: Bearer $REFLECTION_API_KEY" | jq .
```

## Integration tests in this repo

See `tests/reflection.test.ts` for MariaDB integration tests covering:

- Saving category and project preferences (100+ GAINE required)
- Routing resolution to `destinationWallet`
- Balanced holders (`destinationWallet: null`)
- Excluding sub-threshold balances

Run: `npm test`
