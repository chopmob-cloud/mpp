# mpay

HTTP Payment Authentication for TypeScript. Implements the ["Payment" HTTP Authentication Scheme](https://datatracker.ietf.org/doc/draft-ietf-httpauth-payment/) with pluggable payment methods & intents.

```
Client                                              Server
   │                                                   │
   │  (1) fetch('/resource')                           │
   ├──────────────────────────────────────────────────>│
   │                                                   │
   │       (2) challenge = method.intent(request, { ... })
   │             402 + WWW-Authenticate: Payment ...   │
   │<──────────────────────────────────────────────────┤
   │                                                   │
   │  (3) credential = Credential.fromChallenge(challenge)
   │                                                   │
   │  (4) fetch('/resource', Authorization: Payment credential)
   ├──────────────────────────────────────────────────>│
   │                                                   │
   │                    (5) intent.verify(credential)  │
   │                                                   │
   │                    (6) Response.json({ ... })     │
   │                        Payment-Receipt: <receipt> │
   │<──────────────────────────────────────────────────┤
   │                                                   │
```

## Install

```bash
npm i mpay
```

## Quick Start

### Server

```ts
import { Mpay, tempo } from 'mpay/server'

const mpay = Mpay.define({
  methods: [
    tempo({
      rpcUrl: 'https://rpc.testnet.tempo.xyz',
    }),
  ],
  realm: 'api.example.com',
})

export async function handler(request: Request) {
  const challenge = await mpay.tempo.charge(request, {
    amount: '1000000',
    asset: '0x20c0000000000000000000000000000000000001',
    destination: '0x742d35Cc6634c0532925a3b844bC9e7595F8fE00',
    expires: '2030-01-20T12:00:00Z',
  })

  // Payment required — send 402 response with challenge
  if (challenge) return challenge

  // Payment verified — return resource
  return Response.json({ data: '...' })
}
```

#### Node.js Compatibility

Intents accept both Fetch `Request` and Node.js `http.IncomingMessage`. 

Intents can write directly to `http.ServerResponse` by passing the response (`res`) as the second argument.

```ts
import * as http from 'node:http'

http.createServer(async (req, res) => {
  const challenge = await mpay.charge(req, res, {
    amount: '1000000',
    asset: '0x20c0000000000000000000000000000000000001',
    destination: '0x742d35Cc6634c0532925a3b844bC9e7595F8fE00',
    expires: '2030-01-20T12:00:00Z',
  })
  if (challenge) return challenge

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ data: '...' }))
}).listen(3000)
```

### Client

#### Automatic: Fetch Polyfill

The easiest way to use mpay on the client is to polyfill `fetch` to automatically handle 402 responses:

```ts
import { privateKeyToAccount } from 'viem/accounts'
import { Fetch, tempo } from 'mpay/client'

const account = privateKeyToAccount('0x...')

// Globally polyfill fetch (mutates globalThis.fetch)
Fetch.polyfill({
  methods: [
    tempo({
      account,
      rpcUrl: 'https://rpc.testnet.tempo.xyz',
    }),
  ],
})

// Now fetch handles 402 automatically
const res = await fetch('https://api.example.com/resource')

// Restore original fetch if needed
Fetch.restore()
```

#### Automatic: Fetch Wrapper

If you prefer not to polyfill globals, use `Fetch.from` to get a wrapped fetch function:

```ts
import { privateKeyToAccount } from 'viem/accounts'
import { Fetch, tempo } from 'mpay/client'

const account = privateKeyToAccount('0x...')

const fetch = Fetch.from({
  methods: [
    tempo({
      account,
      rpcUrl: 'https://rpc.testnet.tempo.xyz',
    }),
  ],
})

// Use the wrapped fetch — handles 402 automatically
const res = await fetch('https://api.example.com/resource')
```

#### Manual

For more control, you can manually create credentials:

```ts
import { privateKeyToAccount } from 'viem/accounts'
import { Credential, tempo } from 'mpay/client'
import { Challenge } from 'mpay' // for Challenge.fromHeader

const account = privateKeyToAccount('0x...')

const res = await fetch('https://api.example.com/resource')
if (res.status !== 402) return

const challenge = Challenge.fromHeader(res.headers.get('www-authenticate')!)

const credential = await Credential.fromChallenge(challenge, {
  method: tempo({
    account,
    rpcUrl: 'https://rpc.testnet.tempo.xyz',
  }),
})

// Retry with credential
const res2 = await fetch('https://api.example.com/resource', {
  headers: { 'Authorization': `Payment ${credential}` }
})
```

## API Reference

### `mpay`

#### `Challenge`

A parsed payment challenge from a `WWW-Authenticate` header.

```ts
type Challenge = {
  /** Unique challenge identifier */
  id: string
  /** Payment method (e.g., "tempo", "stripe") */
  method: string
  /** Intent type (e.g., "charge", "authorize") */
  intent: string
  /** Method-specific request data */
  request: unknown
}
```

```ts
import { Challenge } from 'mpay'

const challenge = Challenge.from({
  id: 'challenge-id',
  method: 'tempo',
  intent: 'charge',
  request: { amount: '1000000', asset: '0x...', destination: '0x...' },
})
```

#### `Credential`

The credential passed to the `verify` function, containing the challenge ID and client payload.

```ts
type Credential<payload = unknown> = {
  /** The challenge ID from the original 402 response */
  id: string
  /** The validated credential payload */
  payload: payload
  /** Optional payer identifier as a DID (e.g., "did:pkh:eip155:1:0x...") */
  source?: string
}
```

```ts
import { Credential } from 'mpay'

const credential = Credential.from({
  id: 'challenge-id',
  payload: { signature: '0x...' },
})
```

#### `Method.define`

##### Example

```ts
import { Method } from 'mpay'
import { Intents } from 'mpay/tempo'
import { createClient, http } from 'viem'
import { tempo } from 'viem/chains'

export function tempo(options: { rpcUrl?: string | undefined } = {}) {
  const { rpcUrl } = options

  const client = createClient({
    chain: tempo,
    transport: http(rpcUrl),
  })

  return Method.define({
    name: 'tempo',
    intents: {
      authorize: Intent.authorize(client),
      charge: Intent.charge(client),
      subscribe: Intent.subscribe(client),
    },
  })
}

const { charge } = tempo({
  rpcUrl: 'https://rpc.testnet.tempo.xyz',
})
```

#### `Intent.define`

Defines a base intent — a type of payment operation (e.g., `charge`, `authorize`, `subscription`). 
Returns an intent with an `.implement()` method that payment methods use to create their specific implementation.

##### Definition

```ts
import { Schema } from 'mpay'

declare function define(options: {
  schema: {
    /** Request schema as an object of field schemas */
    request: Record<string, Schema.Schema>
  }
}): Intent

interface Intent {
  /** Creates a method-specific implementation of this intent */
  implement(options: {
    schema: {
      request?: {
        /** Optional fields from base schema that this method requires */
        requires?: string[]
        /** Method-specific fields (flattened onto request) */
        methodDetails?: Schema.Schema
      }
      credential: {
        /** Schema for the credential payload */
        payload: Schema.Schema
      }
    }
    /** Verifies a credential and returns a receipt */
    verify(credential: Credential, request: Request): Promise<{ receipt: Receipt }>
  }): MethodIntent
}
```

> **Note:** `Schema.Schema` is a [Standard Schema](https://github.com/standard-schema/standard-schema) — an interoperable schema format supported by [Zod](https://zod.dev), [Valibot](https://valibot.dev), [ArkType](https://arktype.io), and others.

##### Example

This example uses [Zod](https://zod.dev), but any [Standard Schema](https://github.com/standard-schema/standard-schema)-compatible library works.

```ts
import { Intent } from 'mpay'
import { z } from 'zod/mini'

// 1. Define the base Charge intent.
const Charge = Intent.define({
  schema: {
    request: {
      amount: z.string(),
      currency: z.string(),
      recipient: z.optional(z.string()),
      expires: z.optional(z.string()),
      description: z.optional(z.string()),
    },
  },
})

// 2. Payment methods implement the intent.
const charge = Charge.implement({
  schema: {
    request: {
      // Make optional fields required for this method.
      requires: ['expires', 'recipient'],
      
      // Add method-specific fields.
      methodDetails: z.object({
        chainId: z.number(),
      }),
    },
    credential: {
      payload: z.object({
        signature: z.string(),
      }),
    },
  },

  async verify(credential, request) {
    // request has: amount, currency, expires, recipient, chainId
    // credential.payload has: signature
    return {
      receipt: {
        status: 'success',
        timestamp: new Date().toISOString(),
        reference: '0x...',
      },
    }
  },
})
```

#### `Receipt`

Payment receipt returned after successful verification, sent via the `Payment-Receipt` header.

```ts
type Receipt = {
  /** Payment status */
  status: 'success' | 'failed'
  /** ISO 8601 settlement timestamp */
  timestamp: string
  /** Method-specific reference (e.g., transaction hash) */
  reference: string
}
```

```ts
import { Receipt } from 'mpay'

const receipt = Receipt.from({
  status: 'success',
  timestamp: new Date().toISOString(),
  reference: '0x...',
})
```

### `mpay/server`

#### `Mpay.create`

##### Example

```ts
import { Mpay, tempo } from 'mpay/server'

const mpay = Mpay.create({
  methods: [tempo()],
  realm: 'api.example.com',
})
```
