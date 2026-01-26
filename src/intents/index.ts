import { z } from 'zod/mini'
import * as Intent from '../Intent.js'

/**
 * Charge intent — one-time immediate payment.
 *
 * Use `.implement()` to create a method-specific implementation.
 *
 * @example
 * ```ts
 * import { Charge } from 'mpay/intents'
 * import { z } from 'zod/mini'
 *
 * const charge = Charge.implement({
 *   schema: {
 *     request: {
 *       requires: ['expires', 'recipient'],
 *       methodDetails: z.object({ chainId: z.number() }),
 *     },
 *     credential: {
 *       payload: z.object({ signature: z.string() }),
 *     },
 *   },
 *   async verify(credential, request) {
 *     // Verify and return receipt
 *   },
 * })
 * ```
 */
export const Charge = Intent.define({
  schema: {
    request: {
      /** Amount as a string (decimal representation). */
      amount: z.string(),
      /** Currency identifier (ISO code, token address, etc.). */
      currency: z.string(),
      /** Recipient identifier (address, account ID, etc.). */
      recipient: z.optional(z.string()),
      /** ISO 8601 expiration timestamp. */
      expires: z.optional(z.iso.datetime()),
      /** Human-readable description. */
      description: z.optional(z.string()),
      /** External identifier for correlation. */
      externalId: z.optional(z.string()),
    },
  },
})
