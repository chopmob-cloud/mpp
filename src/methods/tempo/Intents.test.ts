import { prepareTransactionRequest, signTransaction } from 'viem/actions'
import { Actions } from 'viem/tempo'
import { describe, expect, test } from 'vitest'
import { accounts, asset, chain, client } from '~test/tempo/viem.js'
import { VerificationError } from '../../Intent.js'
import * as Tempo from './Intents.js'

const consumer = accounts[1]
const recipient = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as const
const amount = '1000000'

describe('charge', () => {
  const intent = Tempo.charge(client)

  describe('request', () => {
    test('behavior: validates and returns request', async () => {
      const request = await intent.request({
        amount,
        currency: asset,
        recipient,
        expires: futureExpiry(),
      })

      expect(request.amount).toBe(amount)
      expect(request.currency).toBe(asset)
      expect(request.recipient).toBe(recipient)
      expect(request.feePayer).toBe(false)
    })

    test('feePayer: true', async () => {
      const request = await intent.request({
        amount,
        currency: asset,
        recipient,
        expires: futureExpiry(),
        feePayer: true,
      })

      expect(request.feePayer).toBe(true)
    })
  })

  describe('verify', () => {
    test('error: rejects expired request', async () => {
      const request = await intent.request({
        amount,
        currency: asset,
        recipient,
        expires: pastExpiry(),
      })

      await expect(
        intent.verify(
          {
            id: 'test-id',
            payload: { type: 'hash', hash: '0x1234' },
          },
          request,
        ),
      ).rejects.toThrow(VerificationError)
    })

    describe("type: 'hash'", () => {
      test('behavior: verifies transaction hash', async () => {
        const { receipt } = await Actions.token.transferSync(client, {
          account: consumer,
          chain,
          token: asset,
          to: recipient,
          amount: BigInt(amount),
        })
        const hash = receipt.transactionHash

        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
        })

        const result = await intent.verify(
          {
            id: 'test-id',
            payload: { type: 'hash', hash },
          },
          request,
        )

        const { reference, timestamp, ...rest } = result.receipt
        expect(reference).toBe(hash)
        expect(timestamp).toBeDefined()
        expect(rest).toMatchInlineSnapshot(`
          {
            "status": "success",
          }
        `)
      })

      test('error: rejects mismatched chain ID', async () => {
        const { receipt } = await Actions.token.transferSync(client, {
          account: consumer,
          chain,
          token: asset,
          to: recipient,
          amount: BigInt(amount),
        })
        const hash = receipt.transactionHash

        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
          chainId: 99999,
        })

        await expect(
          intent.verify(
            {
              id: 'test-id',
              payload: { type: 'hash', hash },
            },
            request,
          ),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Intent.VerificationError: Chain ID mismatch: expected 99999, got ${chain.id}]`,
        )
      })

      test('error: rejects hash without matching transfer log', async () => {
        const { receipt } = await Actions.token.transferSync(client, {
          account: consumer,
          chain,
          token: asset,
          to: '0x0000000000000000000000000000000000000001',
          amount: BigInt(amount),
        })
        const hash = receipt.transactionHash

        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
        })

        await expect(
          intent.verify(
            {
              id: 'test-id',
              payload: { type: 'hash' as const, hash },
            },
            request,
          ),
        ).rejects.toThrow(VerificationError)
      })
    })

    describe("type: 'transaction'", () => {
      test('behavior: verifies transaction with valid transfer call', async () => {
        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
        })

        const prepared = await prepareTransactionRequest(client, {
          account: consumer,
          chain,
          calls: [
            Actions.token.transfer.call({ token: asset, to: recipient, amount: BigInt(amount) }),
          ],
        })
        const serializedTransaction = await signTransaction(client, prepared)

        const result = await intent.verify(
          {
            id: 'test-id',
            payload: { type: 'transaction', signature: serializedTransaction },
          },
          request,
        )

        const { reference, timestamp, ...rest } = result.receipt
        expect(reference).toMatch(/^0x[a-fA-F0-9]{64}$/)
        expect(timestamp).toBeDefined()
        expect(rest).toMatchInlineSnapshot(`
          {
            "status": "success",
          }
        `)
      })

      test('error: rejects mismatched chain ID', async () => {
        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
          chainId: 99999,
        })

        const prepared = await prepareTransactionRequest(client, {
          account: consumer,
          chain,
          calls: [
            Actions.token.transfer.call({ token: asset, to: recipient, amount: BigInt(amount) }),
          ],
        })
        const serializedTransaction = await signTransaction(client, prepared)

        await expect(
          intent.verify(
            {
              id: 'test-id',
              payload: { type: 'transaction', signature: serializedTransaction },
            },
            request,
          ),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Intent.VerificationError: Chain ID mismatch: expected 99999, got ${chain.id}]`,
        )
      })

      test('error: rejects transaction without matching transfer call', async () => {
        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
        })

        const serializedTransaction = await signTransaction(client, {
          account: consumer,
          chain,
          calls: [
            Actions.token.transfer.call({
              token: asset,
              to: '0x0000000000000000000000000000000000000001',
              amount: BigInt(amount),
            }),
          ],
        })

        await expect(
          intent.verify(
            {
              id: 'test-id',
              payload: { type: 'transaction', signature: serializedTransaction },
            },
            request,
          ),
        ).rejects.toThrow(VerificationError)
      })

      test('error: rejects transaction with wrong amount', async () => {
        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
        })

        const serializedTransaction = await signTransaction(client, {
          account: consumer,
          chain,
          calls: [Actions.token.transfer.call({ token: asset, to: recipient, amount: 999999n })],
        })

        await expect(
          intent.verify(
            {
              id: 'test-id',
              payload: { type: 'transaction', signature: serializedTransaction },
            },
            request,
          ),
        ).rejects.toThrow(VerificationError)
      })

      test('error: rejects transaction targeting wrong asset', async () => {
        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
        })

        const wrongAsset = '0x20c0000000000000000000000000000000000002' as const
        const serializedTransaction = await signTransaction(client, {
          account: consumer,
          chain,
          calls: [
            Actions.token.transfer.call({
              token: wrongAsset,
              to: recipient,
              amount: BigInt(amount),
            }),
          ],
        })

        await expect(
          intent.verify(
            {
              id: 'test-id',
              payload: { type: 'transaction', signature: serializedTransaction },
            },
            request,
          ),
        ).rejects.toThrow(VerificationError)
      })

      test('behavior: utilizes fee payer when requested', async () => {
        const request = await intent.request({
          amount,
          currency: asset,
          recipient,
          expires: futureExpiry(),
          feePayer: true,
        })

        const prepared = await prepareTransactionRequest(client, {
          account: consumer,
          chain,
          calls: [
            Actions.token.transfer.call({ token: asset, to: recipient, amount: BigInt(amount) }),
          ],
          feePayer: request.feePayer,
        } as never)
        const serializedTransaction = await signTransaction(client, prepared)

        const result = await intent.verify(
          {
            id: 'test-id',
            payload: { type: 'transaction', signature: serializedTransaction },
          },
          request,
        )

        const { reference, timestamp, ...rest } = result.receipt
        expect(reference).toMatch(/^0x[a-fA-F0-9]{64}$/)
        expect(timestamp).toBeDefined()
        expect(rest).toMatchInlineSnapshot(`
          {
            "status": "success",
          }
        `)
      })
    })
  })
})

function futureExpiry() {
  return new Date(Date.now() + 60_000).toISOString()
}

function pastExpiry() {
  return new Date(Date.now() - 60_000).toISOString()
}
