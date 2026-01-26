import { describe, expect, test, vi } from 'vitest'
import { z } from 'zod/mini'
import * as Intent from './Intent.js'

const TestIntent = Intent.define({
  schema: {
    request: {
      required1: z.string(),
      required2: z.number(),
      optional1: z.optional(z.string()),
      optional2: z.optional(z.boolean()),
    },
  },
})

describe('define', () => {
  test('behavior: returns intent with implement method', () => {
    expect(TestIntent.implement).toBeDefined()
    expect(typeof TestIntent.implement).toBe('function')
  })

  test('behavior: exposes request schema via ~standard', () => {
    expect(TestIntent['~standard'].request).toBeDefined()
    expect(TestIntent['~standard'].request.required1).toBeDefined()
    expect(TestIntent['~standard'].request.optional1).toBeDefined()
  })
})

describe('implement', () => {
  describe('behavior: request validation', () => {
    const intent = TestIntent.implement({
      schema: {
        credential: {
          payload: z.object({ proof: z.string() }),
        },
      },
      async verify() {
        return { receipt: { status: 'success', timestamp: '', reference: '' } }
      },
    })

    test('behavior: validates and returns request with required fields', async () => {
      const request = await intent.request({
        required1: 'hello',
        required2: 42,
      })

      expect(request.required1).toBe('hello')
      expect(request.required2).toBe(42)
    })

    test('behavior: includes optional fields when provided', async () => {
      const request = await intent.request({
        required1: 'hello',
        required2: 42,
        optional1: 'world',
        optional2: true,
      })

      expect(request.optional1).toBe('world')
      expect(request.optional2).toBe(true)
    })

    test('error: throws ValidationError on missing required field', async () => {
      await expect(
        intent.request({
          required1: 'hello',
          // missing required2
        } as never),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - required2: expected number]
      `,
      )
    })

    test('error: throws ValidationError on wrong type', async () => {
      await expect(
        intent.request({
          required1: 'hello',
          required2: 'not a number',
        } as never),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - required2: expected number]
      `,
      )
    })

    test('error: lists multiple errors', async () => {
      await expect(
        intent.request({
          required1: 123,
          required2: 'not a number',
        } as never),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ValidationError: Invalid request:
          - required1: expected string
          - required2: expected number]
      `)
    })
  })

  describe('arg: `requires`', () => {
    const intent = TestIntent.implement({
      schema: {
        request: {
          requires: ['optional1'],
        },
        credential: {
          payload: z.object({ proof: z.string() }),
        },
      },
      async verify() {
        return { receipt: { status: 'success', timestamp: '', reference: '' } }
      },
    })

    test('behavior: makes optional field required', async () => {
      const request = await intent.request({
        required1: 'hello',
        required2: 42,
        optional1: 'now required',
      })

      expect(request.optional1).toBe('now required')
    })

    test('error: throws when required optional is missing', async () => {
      await expect(
        intent.request({
          required1: 'hello',
          required2: 42,
          // missing optional1 which is now required
        } as never),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - optional1: expected string]
      `,
      )
    })

    test('error: rejects undefined for required optional field', async () => {
      await expect(
        intent.request({
          required1: 'hello',
          required2: 42,
          optional1: undefined as never,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - optional1: expected string]
      `,
      )
    })
  })

  describe('arg: `methodDetails`', () => {
    const intent = TestIntent.implement({
      schema: {
        request: {
          methodDetails: z.object({
            chainId: z.number(),
            debug: z._default(z.boolean(), false),
          }),
        },
        credential: {
          payload: z.object({ proof: z.string() }),
        },
      },
      async verify() {
        return { receipt: { status: 'success', timestamp: '', reference: '' } }
      },
    })

    test('behavior: validates methodDetails', async () => {
      const request = await intent.request({
        required1: 'hello',
        required2: 42,
        chainId: 1,
      })

      expect(request.chainId).toBe(1)
      expect(request.debug).toBe(false)
    })

    test('error: throws on invalid methodDetails', async () => {
      await expect(
        intent.request({
          required1: 'hello',
          required2: 42,
          chainId: 'not a number',
        } as never),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - chainId: expected number]
      `,
      )
    })
  })

  describe('behavior: verify', () => {
    test('behavior: validates credential payload before calling verify', async () => {
      const verifyFn = vi.fn().mockResolvedValue({
        receipt: { status: 'success', timestamp: '', reference: '' },
      })

      const intent = TestIntent.implement({
        schema: {
          credential: {
            payload: z.object({
              signature: z.string(),
              nonce: z.number(),
            }),
          },
        },
        verify: verifyFn,
      })

      const request = await intent.request({
        required1: 'hello',
        required2: 42,
      })

      await intent.verify(
        {
          id: 'challenge-id',
          payload: { signature: '0xabc', nonce: 123 },
        },
        request,
      )

      expect(verifyFn).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'challenge-id',
          payload: { signature: '0xabc', nonce: 123 },
        }),
        request,
      )
    })

    test('behavior: passes source through to verify function', async () => {
      const verifyFn = vi.fn().mockResolvedValue({
        receipt: { status: 'success', timestamp: '', reference: '' },
      })

      const intent = TestIntent.implement({
        schema: {
          credential: {
            payload: z.object({ proof: z.string() }),
          },
        },
        verify: verifyFn,
      })

      const request = await intent.request({
        required1: 'hello',
        required2: 42,
      })

      await intent.verify(
        {
          id: 'challenge-id',
          source: 'did:pkh:eip155:1:0x1234',
          payload: { proof: 'abc' },
        },
        request,
      )

      expect(verifyFn).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'did:pkh:eip155:1:0x1234',
        }),
        request,
      )
    })

    test('behavior: returns receipt from verify function', async () => {
      const intent = TestIntent.implement({
        schema: {
          credential: {
            payload: z.object({ proof: z.string() }),
          },
        },
        async verify() {
          return {
            receipt: {
              status: 'success',
              timestamp: '2025-01-06T12:00:00Z',
              reference: 'tx_123',
            },
          }
        },
      })

      const request = await intent.request({
        required1: 'hello',
        required2: 42,
      })

      const result = await intent.verify({ id: 'challenge-id', payload: { proof: 'abc' } }, request)

      expect(result.receipt).toEqual({
        status: 'success',
        timestamp: '2025-01-06T12:00:00Z',
        reference: 'tx_123',
      })
    })

    test('error: throws ValidationError on invalid credential payload', async () => {
      const intent = TestIntent.implement({
        schema: {
          credential: {
            payload: z.object({
              signature: z.string(),
            }),
          },
        },
        async verify() {
          return { receipt: { status: 'success', timestamp: '', reference: '' } }
        },
      })

      const request = await intent.request({
        required1: 'hello',
        required2: 42,
      })

      await expect(
        intent.verify(
          {
            id: 'challenge-id',
            payload: { signature: 123 } as never,
          },
          request,
        ),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid credentialPayload:
          - signature: expected string]
      `,
      )
    })
  })

  describe('~standard metadata', () => {
    test('behavior: exposes methodDetails schema', () => {
      const methodDetailsSchema = z.object({ chainId: z.number() })

      const intent = TestIntent.implement({
        schema: {
          request: {
            methodDetails: methodDetailsSchema,
          },
          credential: {
            payload: z.object({ proof: z.string() }),
          },
        },
        async verify() {
          return { receipt: { status: 'success', timestamp: '', reference: '' } }
        },
      })

      expect(intent['~standard'].methodDetails).toBe(methodDetailsSchema)
    })

    test('behavior: exposes credentialPayload schema', () => {
      const credentialPayloadSchema = z.object({ signature: z.string() })

      const intent = TestIntent.implement({
        schema: {
          credential: {
            payload: credentialPayloadSchema,
          },
        },
        async verify() {
          return { receipt: { status: 'success', timestamp: '', reference: '' } }
        },
      })

      expect(intent['~standard'].credentialPayload).toBe(credentialPayloadSchema)
    })
  })
})

describe('errors', () => {
  test('error: VerificationError has correct name', () => {
    const error = new Intent.VerificationError('test')
    expect(error.name).toBe('Intent.VerificationError')
    expect(error.message).toBe('test')
  })

  test('error: InvalidCredentialTypeError has correct name and message', () => {
    const error = new Intent.InvalidCredentialTypeError('unknown')
    expect(error.name).toBe('Intent.InvalidCredentialTypeError')
    expect(error.message).toBe('Invalid credential type: unknown')
  })
})
