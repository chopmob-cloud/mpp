---
name: mpay-ts-docs-reference
description: Writing TypeScript API reference documentation for mpay. Use when creating new reference pages for mpay TypeScript SDK functions and modules.
---

# Writing mpay TypeScript Reference APIs

Reference documentation pages follow a consistent structure based on viem.sh docs.

## Specifications

When writing documentation, refer to the official Payment Auth specifications at https://paymentauth.tempo.xyz/ for:
- Protocol details and terminology
- Challenge/Credential flow
- Intent types (charge, authorize, subscription)
- Method implementations
- Transport protocols (HTTP, MCP)

## File Location

Reference pages go in `src/pages/sdk/typescript/`:
- Client: `src/pages/sdk/typescript/client/{Module}.{method}.mdx`
- Server: `src/pages/sdk/typescript/server/{Module}.{method}.mdx`
- Core: `src/pages/sdk/typescript/{Module}.{method}.mdx`

## Page Structure

Every reference page follows this structure:

```mdx
# `{Module}.{method}`

Brief one-line description of what this function does.

## Usage

```ts twoslash [example.ts]
import { Module } from 'mpay'
// or 'mpay/client' or 'mpay/server'

const result = Module.method({
  param1: 'value1',
  param2: 'value2',
})

console.log(result)
// @log: Expected output
```

### With Custom Transport

Description of what this variant does and when to use it.

```ts twoslash [example.ts]
import { Module, Transport } from 'mpay'

const result = Module.method({
  param1: 'value1',
  transport: Transport.mcp(),
})
```

## Return Type

```ts
type ReturnType = {
  // describe the return type
}
```

## Parameters

### paramName

- **Type:** `TypeName`

Description of what this parameter does.

### optionalParam (optional)

- **Type:** `TypeName`

Description of the optional parameter.
```

## Example: Fetch.from

```mdx
# `Fetch.from`

Creates a fetch wrapper that automatically handles 402 Payment Required responses.

## Usage

:::code-group

```ts twoslash [example.ts]
import { Fetch, tempo } from 'mpay/client'
import { privateKeyToAccount } from 'viem/accounts'

const fetch = Fetch.from({
  methods: [
    tempo({
      account: privateKeyToAccount('0x...'),
      rpcUrl: 'https://rpc.tempo.xyz',
    }),
  ],
})

const res = await fetch('https://api.example.com/resource')
// @log: Response { status: 200, ... }
```

:::

## Return Type

```ts
type ReturnType = (
  input: RequestInfo | URL,
  init?: RequestInit & { context?: AnyContextFor<methods> }
) => Promise<Response>
```

## Parameters

### methods

- **Type:** `readonly Method.AnyClient[]`

Array of payment methods to use for handling 402 responses.

### fetch (optional)

- **Type:** `typeof globalThis.fetch`

Custom fetch function to wrap. Defaults to `globalThis.fetch`.
```

## Rules

1. **Alphabetize everything** - Object properties in code examples and ### Parameter headings must be alphabetically ordered
2. **No code-groups for variants** - Use separate ### sections under ## Usage for different usage patterns (e.g., `### With MCP Transport`), not `:::code-group`
3. **Keep descriptions concise** - One line for the intro, brief explanations for parameters
4. **Show realistic examples** - Use actual values that make sense
5. **Use `// @log:` comments** - Show expected output inline
6. **Document all parameters** - Mark optional ones with "(optional)"
7. **Include type information** - Always show the Type for each parameter
