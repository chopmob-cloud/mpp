import * as Challenge from '../Challenge.js'
import type * as Method from '../Method.js'

type AnyClient = Method.Client<any, any>

/**
 * Client-side payment handler.
 */
export type Mpay<methods extends readonly AnyClient[] = readonly AnyClient[]> = {
  /** The configured payment methods. */
  methods: methods
  /** Creates a credential from a 402 response by routing to the correct method. */
  createCredential: (response: Response) => Promise<string>
}

/**
 * Creates a client-side payment handler from an array of methods.
 *
 * @example
 * ```ts
 * import { Mpay } from 'mpay/client'
 * import { tempo } from 'mpay/tempo/client'
 *
 * const mpay = Mpay.create({
 *   methods: [
 *     tempo({
 *       account: privateKeyToAccount('0x...'),
 *       rpcUrl: 'https://rpc.tempo.xyz',
 *     }),
 *   ],
 * })
 *
 * const response = await fetch('/resource')
 * if (response.status === 402) {
 *   const credential = await mpay.createCredential(response)
 *   // Retry with credential
 *   await fetch('/resource', {
 *     headers: { Authorization: credential },
 *   })
 * }
 * ```
 */
export function create<const methods extends readonly AnyClient[]>(
  config: create.Config<methods>,
): Mpay<methods> {
  const { methods } = config

  return {
    methods,
    async createCredential(response: Response) {
      const challenge = Challenge.fromResponse(response)

      const method = methods.find((m) => m.name === challenge.method)
      if (!method)
        throw new Error(
          `No method found for "${challenge.method}". Available: ${methods.map((m) => m.name).join(', ')}`,
        )

      return method.createCredential({ challenge } as never)
    },
  }
}

export declare namespace create {
  type Config<methods extends readonly AnyClient[] = readonly AnyClient[]> = {
    /** Array of payment methods to use. */
    methods: methods
  }
}
