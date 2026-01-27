import { AbiFunction, Address } from 'ox'
import {
  type Account,
  type Client,
  createClient,
  defineChain,
  http,
  parseEventLogs,
  type TransactionReceipt,
} from 'viem'
import { tempo as tempo_chain } from 'viem/chains'
import { getTransactionReceipt, sendRawTransactionSync, signTransaction } from 'viem/actions'
import { Abis, Transaction } from 'viem/tempo'

import * as ServerPaymentHandler from '../../server/PaymentHandler.js'
import * as Intents from '../Intents.js'

const transfer = AbiFunction.from('function transfer(address to, uint256 amount) returns (bool)')

/**
 * Creates a Tempo server-side payment handler.
 *
 * @example
 * ```ts
 * import { PaymentHandler } from 'mpay/tempo/server'
 *
 * const payment = PaymentHandler.tempo({
 *   chainId: 42431,
 *   rpcUrl: 'https://rpc.testnet.tempo.xyz',
 *   realm: 'api.example.com',
 *   secretKey: process.env.PAYMENT_SECRET_KEY,
 * })
 *
 * // Or with a viem client
 * const payment = PaymentHandler.tempo({
 *   client,
 *   realm: 'api.example.com',
 *   secretKey: process.env.PAYMENT_SECRET_KEY,
 * })
 * ```
 */
export function tempo(parameters: tempo.Parameters) {
  const { realm, secretKey, feePayer } = parameters

  const client = (() => {
    if ('client' in parameters) return parameters.client
    return createClient({
      chain: defineChain({
        ...tempo_chain,
        id: parameters.chainId,
        name: 'Tempo',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: { default: { http: [parameters.rpcUrl] } },
      }),
      transport: http(parameters.rpcUrl),
    })
  })()

  return ServerPaymentHandler.from({
    method: 'tempo',
    realm,
    secretKey,
    intents: {
      authorize: Intents.authorize,
      charge: Intents.charge,
      subscription: Intents.subscription,
    },
    async verify({ credential }) {
      const { challenge } = credential

      switch (challenge.intent) {
        case 'charge': {
          const { request } = challenge
          const { amount, expires, methodDetails } = request

          const currency = request.currency as Address.Address
          const recipient = request.recipient as Address.Address

          if (new Date(expires) < new Date()) throw new Error('Payment request expired.')

          const payload = credential.payload

          switch (payload.type) {
            case 'hash': {
              const hash = payload.hash as `0x${string}`
              const receipt = await getTransactionReceipt(client, {
                hash,
              })

              const logs = parseEventLogs({
                abi: Abis.tip20,
                eventName: 'Transfer',
                logs: receipt.logs,
              })

              const match = logs.find(
                (log) =>
                  Address.isEqual(log.address, currency) &&
                  Address.isEqual(log.args.to, recipient) &&
                  log.args.amount.toString() === amount,
              )

              if (!match)
                throw new MismatchError(
                  'Payment verification failed: no matching transfer found.',
                  {
                    amount,
                    currency,
                    recipient,
                  },
                )

              return toReceipt(receipt)
            }

            case 'transaction': {
              const serializedTransaction =
                payload.signature as Transaction.TransactionSerializedTempo
              const transaction = Transaction.deserialize(serializedTransaction)

              const transferCall = transaction.calls?.find((call) => {
                if (!call.to || !Address.isEqual(call.to, currency)) return false
                if (!call.data) return false

                try {
                  const [to, amount_] = AbiFunction.decodeData(transfer, call.data)
                  return Address.isEqual(to, recipient) && amount_.toString() === amount
                } catch {
                  return false
                }
              })

              if (!transferCall)
                throw new MismatchError('Invalid transaction: missing transfer call.', {
                  amount,
                  currency,
                  recipient,
                })

              const serializedTransaction_final = await (async () => {
                if (methodDetails?.feePayer && feePayer) {
                  return signTransaction(client, {
                    ...transaction,
                    account: feePayer,
                    feePayer,
                  } as never)
                }
                return serializedTransaction
              })()

              const receipt = await sendRawTransactionSync(client, {
                serializedTransaction: serializedTransaction_final,
              })

              return toReceipt(receipt)
            }

            default:
              throw new Error(
                `Unsupported credential type "${(payload as { type: string }).type}". Expected "hash" or "transaction".`,
              )
          }
        }

        default:
          throw new Error(
            `Unsupported intent "${challenge.intent}". Tempo currently supports "charge".`,
          )
      }
    },
  })
}

export declare namespace tempo {
  type Parameters = {
    /** Server realm (e.g., hostname). */
    realm: string
    /** Secret key for HMAC-bound challenge IDs. */
    secretKey: string
    /** Optional fee payer account for co-signing transactions. */
    feePayer?: Account | undefined
  } & (
    | {
        /** Viem Client. */
        client: Client
      }
    | {
        /** Tempo chain ID. */
        chainId: number
        /** Tempo RPC URL. */
        rpcUrl: string
      }
  )
}

/** @internal */
export function toReceipt(receipt: TransactionReceipt) {
  return {
    method: 'tempo',
    status: receipt.status === 'success' ? 'success' : 'failed',
    timestamp: new Date().toISOString(),
    reference: receipt.transactionHash,
  } as const
}

/** @internal */
class MismatchError extends Error {
  override readonly name = 'MismatchError'

  constructor(reason: string, details: Record<string, string>) {
    super([reason, ...Object.entries(details).map(([k, v]) => `  - ${k}: ${v}`)].join('\n'))
  }
}
