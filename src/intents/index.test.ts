import { describe, expect, test } from 'vitest'
import { z } from 'zod/mini'
import { Charge } from './index.js'

const tempoCharge = Charge.implement({
  schema: {
    request: {
      requires: ['expires', 'recipient'],
      methodDetails: z.object({
        chainId: z.number(),
        feePayer: z._default(z.boolean(), false),
      }),
    },
    credential: {
      payload: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('hash'),
          hash: z.templateLiteral([z.literal('0x'), z.string()]),
        }),
        z.object({
          type: z.literal('transaction'),
          signature: z.templateLiteral([z.literal('0x'), z.string()]),
        }),
      ]),
    },
  },

  async verify() {
    return {
      receipt: {
        status: 'success',
        timestamp: new Date().toISOString(),
        reference: '0xabc123...',
      },
    }
  },
})

describe('implement', () => {
  describe('request', () => {
    test('behavior: validates required fields from base schema', async () => {
      const request = await tempoCharge.request({
        amount: '1000000',
        currency: '0x20c0000000000000000000000000000000000001',
        recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
        expires: '2025-01-06T12:00:00Z',
        chainId: 42431,
      })

      expect(request).toMatchInlineSnapshot(`
        {
          "amount": "1000000",
          "chainId": 42431,
          "currency": "0x20c0000000000000000000000000000000000001",
          "expires": "2025-01-06T12:00:00Z",
          "feePayer": false,
          "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00",
        }
      `)
    })

    test('behavior: includes optional fields when provided', async () => {
      const request = await tempoCharge.request({
        amount: '1000000',
        currency: '0x20c0000000000000000000000000000000000001',
        recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
        expires: '2025-01-06T12:00:00Z',
        description: 'Test payment',
        externalId: 'order_123',
        chainId: 42431,
        feePayer: true,
      })

      expect(request.description).toBe('Test payment')
      expect(request.externalId).toBe('order_123')
      expect(request.feePayer).toBe(true)
    })

    test('error: throws when required optional field is missing', async () => {
      await expect(
        tempoCharge.request({
          amount: '1000000',
          currency: '0x20c0000000000000000000000000000000000001',
          // missing: recipient (required by this method)
          expires: '2025-01-06T12:00:00Z',
          chainId: 42431,
        } as never),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - recipient: expected string]
      `,
      )
    })

    test('error: throws on invalid expires format', async () => {
      await expect(
        tempoCharge.request({
          amount: '1000000',
          currency: '0x20c0000000000000000000000000000000000001',
          recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
          expires: 'not-a-date',
          chainId: 42431,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid request:
          - expires: Invalid input]
      `,
      )
    })
  })

  describe('verify', () => {
    test('behavior: validates and verifies credential', async () => {
      const request = await tempoCharge.request({
        amount: '1000000',
        currency: '0x20c0000000000000000000000000000000000001',
        recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
        expires: '2025-01-06T12:00:00Z',
        chainId: 42431,
      })

      const {
        receipt: { timestamp, ...rest },
      } = await tempoCharge.verify(
        {
          id: 'kM9xPqWvT2nJrHsY4aDfEb',
          source: 'did:pkh:eip155:42431:0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
          payload: {
            type: 'transaction',
            signature: '0x76abc123...',
          },
        },
        request,
      )

      expect(timestamp).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
        {
          "reference": "0xabc123...",
          "status": "success",
        }
      `)
    })

    test('error: throws on invalid credential payload', async () => {
      const request = await tempoCharge.request({
        amount: '1000000',
        currency: '0x20c0000000000000000000000000000000000001',
        recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
        expires: '2025-01-06T12:00:00Z',
        chainId: 42431,
      })

      await expect(
        tempoCharge.verify(
          {
            id: 'test',
            payload: { type: 'invalid', signature: '0x123' } as never,
          },
          request,
        ),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [ValidationError: Invalid credentialPayload:
          - type: Invalid input]
      `,
      )
    })
  })
})

describe('implement without methodDetails', () => {
  const simpleCharge = Charge.implement({
    schema: {
      request: {
        requires: ['recipient'],
      },
      credential: {
        payload: z.object({
          proof: z.string(),
        }),
      },
    },
    async verify() {
      return {
        receipt: {
          status: 'success',
          timestamp: new Date().toISOString(),
          reference: 'ref_123',
        },
      }
    },
  })

  test('behavior: works without methodDetails', async () => {
    const request = await simpleCharge.request({
      amount: '100',
      currency: 'USD',
      recipient: 'acct_123',
    })

    expect(request).toMatchInlineSnapshot(`
      {
        "amount": "100",
        "currency": "USD",
        "recipient": "acct_123",
      }
    `)
  })
})
