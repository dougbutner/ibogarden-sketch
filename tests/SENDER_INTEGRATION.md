# GAINE Reflection Sender Integration

Instructions for the **separate sender repo** that distributes USDC on Solana based on holder preferences stored in ibogarden-sketch.

This ibogarden-sketch repo **does not send transactions**. It stores holder preferences and exposes them via an authenticated read API.

## Purpose

GAINE has a 2% transfer fee. Holders with **100+ GAINE** can save a reflection direction on `/gaine` (registered category or unregistered custom Solana address). The sender service reads those preferences and sends each holder's USDC share to the resolved **beneficiary Solana address**.

## API

```
GET https://ibo.garden/api/reflection/routing
Authorization: Bearer <REFLECTION_API_KEY>
```

Alternative header:

```
x-reflection-api-key: <REFLECTION_API_KEY>
```

## Response shape

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
      "holderWallet": "HolderSolanaAddress...",
      "gaineBalance": "1000.00000000",
      "destinationType": "category",
      "destinationSlug": "tech_innovation",
      "destinationWallet": "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
      "customTitle": null,
      "updatedAt": "2026-07-08T12:00:00.000Z"
    },
    {
      "userAccountId": 43,
      "holderWallet": "AnotherHolder...",
      "gaineBalance": "250.00000000",
      "destinationType": "unregistered",
      "destinationSlug": "unregistered_project",
      "destinationWallet": "CustomRecipientSolanaAddress...",
      "customTitle": "Community Garden Pilot",
      "updatedAt": "2026-07-08T12:05:00.000Z"
    }
  ]
}
```

### Field reference

| Field | Meaning |
|---|---|
| `routing[]` | One row per registered holder wallet with `last_gaine_balance >= 100` |
| `userAccountId` | Internal account id |
| `holderWallet` | Solana address of the GAINE holder |
| `gaineBalance` | Cached balance from last wallet verify |
| `destinationType` | `"category"` \| `"unregistered"` \| `"balanced"` |
| `destinationSlug` | Category slug; `null` when balanced |
| `destinationWallet` | Solana address to receive USDC when not null |
| `customTitle` | Short title when `destinationType` is `"unregistered"`; otherwise `null` |
| `updatedAt` | When the holder last saved their direction |
| `categories` | Registered directions with default wallets (`unregistered_project` has `solanaWallet: null`) |
| `projects` | Always `[]` (curated project list retired) |

### `destinationType` behavior

| Type | `destinationWallet` | Sender action |
|---|---|---|
| `category` | Category default wallet | Send holder's USDC share there |
| `unregistered` | Holder-supplied wallet | Send holder's USDC share there; use `customTitle` for logging |
| `balanced` | `null` | No saved direction — sender decides policy |

## Recommended sender algorithm

1. Poll `GET /api/reflection/routing` before each distribution batch.
2. Build a lookup from `holderWallet` → `{ destinationWallet, destinationType, customTitle, updatedAt }`.
3. For each holder share:
   - If `destinationWallet` is set → transfer USDC there.
   - If `destinationType === "balanced"` → apply your default policy.
4. Use `updatedAt` to detect preference changes between runs.

## Auth / errors

| Status | Meaning |
|---|---|
| `200` | Success; `routing` may be empty |
| `401` | Invalid or missing API key |
| `503` | `REFLECTION_API_KEY` not configured |

Store `REFLECTION_API_KEY` as a server secret only.

## GAINE constants

| Constant | Value |
|---|---|
| GAINE mint | `ibozy4AxS6TdsBDerGJN1ZKFFohEubFdHWGcyLxPLFL` |
| Transfer fee | 2% |
| Reflection eligibility | 100 GAINE minimum |

## What each repo owns

| ibogarden-sketch | Sender repo |
|---|---|
| Holder category or custom title+wallet | USDC amount per holder |
| Resolved `destinationWallet` | Solana USDC transfers |
| Filters holders with 100+ GAINE in DB | Fee collection / swap |
| Read-only routing API | Balanced-holder default policy |

## Verification

```bash
curl -sS "https://ibo.garden/api/reflection/routing" \
  -H "Authorization: Bearer $REFLECTION_API_KEY" | jq .
```

Run integration tests: `npm test` (see `tests/reflection.test.ts`).
