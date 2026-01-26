# mpay

TypeScript implementation of the "Payment" HTTP Authentication Scheme (402 Protocol).

## Vision

mpay provides abstractions for the complete HTTP 402 payment flow — both client and server. The architecture has three layers:

### Core Abstractions

1. **`Mpay`** — Top-level abstraction over the HTTP payment spec. Handles challenge/credential parsing, header serialization, and the 402/401 response flow. This is the protocol skeleton that works with any payment network.

2. **`PaymentMethod`** — Extensible adapters for specific payment networks (Tempo, Stripe, x402, Lightning, etc.). Each method defines its own request/payload schemas and verification logic. Consumers can build custom methods to plug into `Mpay`.

3. **`Intent`** — Actions that hang off a `PaymentMethod`. Standard intents include `charge`, `authorize`, and `subscription`. Each intent defines what the server requests and what the client must prove.

### Primitives

Low-level data structures that compose into the core abstractions:

- **`Challenge`** — Server-issued payment request (appears in `WWW-Authenticate` header). Contains `id`, `realm`, `method`, `intent`, `request`, and optional `expires`/`digest`.
- **`Credential`** — Client-submitted payment proof (appears in `Authorization` header). Contains `challenge` echo, `payload` (method-specific proof), and optional `source` (payer identity).
- **`Receipt`** — Server-issued settlement confirmation (appears in `Payment-Receipt` header). Contains `status`, `method`, `timestamp`, and `reference`.

### Relationship

```
┌───────────────┐         ┌─────────────────┐         ┌────────────────┐
│     Mpay      │ 1     * │  PaymentMethod  │ *     * │     Intent     │
│  (protocol)   ├─────────┤    (adapter)    ├─────────┤    (action)    │
└───────────────┘ has     └─────────────────┘ impl.   └────────────────┘
                          │ tempo           │         │ charge         │
                          │ stripe          │         │ authorize      │
                          │ x402            │         │ subscription   │
                          └─────────────────┘         └────────────────┘
```

## Spec Reference

Canonical specs live at [tempoxyz/payment-auth-spec](https://github.com/tempoxyz/payment-auth-spec).

### Spec Documents

| Layer | Spec | Description |
|-------|------|-------------|
| **Core** | [draft-httpauth-payment-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/core/draft-httpauth-payment-00.md) | 402 flow, `WWW-Authenticate`/`Authorization` headers, `Payment-Receipt` |
| **Intent** | [draft-payment-intent-charge-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/intents/draft-payment-intent-charge-00.md) | One-time immediate payment |
| **Intent** | [draft-payment-intent-authorize-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/intents/draft-payment-intent-authorize-00.md) | Pre-authorization for later capture |
| **Intent** | [draft-payment-intent-subscription-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/intents/draft-payment-intent-subscription-00.md) | Recurring periodic payments |
| **Method** | [draft-tempo-charge-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/methods/tempo/draft-tempo-charge-00.md) | TIP-20 token transfers on Tempo |
| **Method** | [draft-tempo-authorize-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/methods/tempo/draft-tempo-authorize-00.md) | Access Key delegation with limits |
| **Method** | [draft-stripe-charge-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/methods/stripe/draft-stripe-charge-00.md) | Stripe Payment Tokens (SPTs) |
| **Extension** | [draft-payment-discovery-00](https://github.com/tempoxyz/payment-auth-spec/blob/main/specs/extensions/draft-payment-discovery-00.md) | `/.well-known/payment` discovery |

### Key Protocol Details

- **Challenge**: `WWW-Authenticate: Payment id="...", realm="...", method="...", intent="...", request="<base64url>"`
- **Credential**: `Authorization: Payment <base64url>` → `{ challenge, payload, source? }`
- **Receipt**: `Payment-Receipt: <base64url>` → `{ status, method, timestamp, reference }`
- **Encoding**: All JSON payloads use base64url without padding (RFC 4648)

### Challenge ID Binding

The challenge `id` is an HMAC-SHA256 over the challenge parameters, cryptographically binding the ID to its contents. This prevents tampering and ensures the server can verify challenge integrity without storing state.

**HMAC input** (concatenated, pipe-delimited):

```
realm | method | intent | request | expires
```

**Generation:**

```
id = base64url(HMAC-SHA256(server_secret, input))
```

**Verification:** Server recomputes HMAC from echoed challenge parameters and compares to `id`. If mismatch, reject credential.

## Commands

```bash
pnpm build          # Build with zile
pnpm check          # Lint and format with biome
pnpm check:types    # TypeScript type checking
pnpm test           # Run tests with vitest
```

## Skills Reference

Load these skills for specialized guidance:

### `payment-auth-scheme-author`

**Use when**: Implementing payment intents, understanding the 402 protocol flow, working with Tempo/Stripe payment method schemas, or referencing the IETF spec.

### `typescript-library-best-practices`

**Use when**: Building new modules, structuring exports, or following library patterns.

### `typescript-style-guide`

**Use when**: Writing or reviewing TypeScript code for style and conventions.

### `tempo-developer`

**Use when**: Referencing Tempo protocol specifics, understanding TIP-20 tokens, Tempo transactions (0x76), or protocol-level details.
