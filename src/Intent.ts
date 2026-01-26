import { z } from 'zod/mini'
import type * as Credential from './Credential.js'
import type * as Receipt from './Receipt.js'
import * as S from './Schema.js'

export { ValidationError } from './Schema.js'

/**
 * Base intent that can be implemented by payment methods.
 *
 * Created via `Intent.define`, this provides the `.implement()` method
 * that payment methods use to create their specific implementation.
 */
export type Intent<requestSchema extends Record<string, S.Schema>> = {
  readonly '~standard': {
    readonly request: requestSchema
  }

  /**
   * Creates a method-specific intent implementation.
   *
   * Payment methods use this to create their implementation of the intent,
   * specifying which optional fields they require and their method-specific schemas.
   */
  implement: <
    const requires extends OptionalKeys<requestSchema> = never,
    const methodDetails extends S.Schema | undefined = undefined,
    const credentialPayload extends S.Schema = S.Schema,
  >(
    options: implement.Options<{
      credentialPayload: credentialPayload
      methodDetails: methodDetails
      requestSchema: requestSchema
      requires: requires
    }>,
  ) => MethodIntent<{
    credentialPayload: credentialPayload
    methodDetails: methodDetails
    requestSchema: requestSchema
    requires: requires
  }>
}

/**
 * A method-specific intent implementation.
 */
export type MethodIntent<config extends MethodIntent.Config = MethodIntent.Config> = {
  readonly '~standard': {
    readonly credentialPayload: config['credentialPayload']
    readonly methodDetails: config['methodDetails']
  }

  /**
   * Create a well-formed request payload.
   * Validates input against the merged request schema and returns the typed output.
   */
  request(input: MergedRequest<config, 'input'>): Promise<MergedRequest<config>>

  /**
   * Verifies a Payment credential.
   */
  verify(
    credential: Credential.Credential<S.Schema.InferOutput<config['credentialPayload']>>,
    request: MergedRequest<config>,
  ): Promise<MethodIntent.verify.ReturnType>
}

export declare namespace MethodIntent {
  type Config = {
    credentialPayload: S.Schema
    methodDetails: S.Schema | undefined
    requestSchema: Record<string, S.Schema>
    requires: PropertyKey
  }

  export namespace verify {
    type ReturnType = {
      /** Receipt data for Payment-Receipt header. */
      receipt: Receipt.Receipt
    }

    /** Request type for the verify callback - only includes required keys, `requires` keys, and methodDetails. */
    type Request<config extends Config> = {
      [key in RequiredKeys<config['requestSchema']>]: S.Schema.InferOutput<
        config['requestSchema'][key]
      >
    } & {
      [key in config['requires'] & keyof config['requestSchema']]: NonUndefined<
        S.Schema.InferOutput<config['requestSchema'][key]>
      >
    } & (config['methodDetails'] extends S.Schema
        ? S.Schema.InferOutput<config['methodDetails']>
        : unknown)
  }
}

/**
 * Defines a new intent.
 *
 * An intent describes a type of payment operation (e.g., charge, authorize, subscription)
 * and provides a base request schema with required and optional fields.
 *
 * Payment methods then use `.implement()` to create their specific implementation,
 * specifying which optional fields they require and their method-specific schemas.
 *
 * @example
 * ```ts
 * import { Intent } from 'mpay'
 * import { z } from 'zod/mini'
 *
 * // Define the Charge intent with its base schema
 * const Charge = Intent.define({
 *   schema: {
 *     request: {
 *       // Required fields
 *       amount: z.string(),
 *       currency: z.string(),
 *
 *       // Optional fields (methods can make these required)
 *       recipient: z.optional(z.string()),
 *       expires: z.optional(z.iso.datetime()),
 *       description: z.optional(z.string()),
 *       externalId: z.optional(z.string()),
 *     },
 *   },
 * })
 *
 * // Payment method creates its implementation
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
export function define<const schema extends { request: Record<string, S.Schema> }>(
  options: define.Options<schema>,
): define.ReturnType<schema> {
  const { schema: s } = options

  return {
    '~standard': {
      request: s.request,
    },

    implement(intentOptions) {
      const { credential, request } = intentOptions.schema

      const requires = request?.requires ?? []
      const methodDetails = request?.methodDetails
      const credentialPayload = credential.payload

      const required = new Set(requires as readonly string[])

      const schema: Record<string, S.Schema> = {}
      for (const [key, field] of Object.entries(s.request)) {
        if (required.has(key)) {
          const inner = field as { _zod?: { def?: { type?: string; innerType?: S.Schema } } }
          schema[key] =
            inner._zod?.def?.type === 'optional' && inner._zod.def.innerType
              ? inner._zod.def.innerType
              : field
        } else schema[key] = field
      }
      if (methodDetails) {
        const shape = (methodDetails as { _zod?: { def?: { shape?: Record<string, S.Schema> } } })
          ._zod?.def?.shape
        if (shape) Object.assign(schema, shape)
      }
      const requestSchema = z.object(schema)

      return {
        '~standard': {
          credentialPayload,
          methodDetails,
        },

        async request(input: unknown) {
          const result = await requestSchema['~standard'].validate(input)
          return S.unwrap(result, 'request') as never
        },

        async verify(credential: Credential.Credential, req: unknown) {
          const result = await credentialPayload['~standard'].validate(credential.payload)
          const payload = S.unwrap(result, 'credentialPayload')
          return intentOptions.verify({ ...credential, payload } as never, req as never)
        },
      } as never
    },
  }
}

export declare namespace define {
  type Options<schema extends { request: Record<string, S.Schema> }> = {
    /** Base schema definition for this intent. */
    schema: schema
  }

  type ReturnType<schema extends { request: Record<string, S.Schema> }> = Intent<schema['request']>
}

export declare namespace implement {
  type Options<config extends MethodIntent.Config> = {
    schema: {
      request?:
        | {
            /** Optional fields from the base schema that this method requires. */
            requires?: readonly config['requires'][] | undefined
            /** Method-specific details schema. */
            methodDetails?: config['methodDetails'] | undefined
          }
        | undefined
      credential: {
        /** Schema for the credential payload. */
        payload: config['credentialPayload']
      }
    }
    /** Verifies a credential and returns a receipt. */
    verify(
      credential: Credential.Credential<S.Schema.InferOutput<config['credentialPayload']>>,
      request: MethodIntent.verify.Request<config>,
    ): Promise<MethodIntent.verify.ReturnType>
  }

  type ReturnType<config extends MethodIntent.Config> = MethodIntent<config>
}

export class VerificationError extends Error {
  override readonly name = 'Intent.VerificationError'
}

export class InvalidCredentialTypeError extends Error {
  override readonly name = 'Intent.InvalidCredentialTypeError'

  constructor(type: string) {
    super(`Invalid credential type: ${type}`)
  }
}

/** Removes undefined from a type (for making optional fields required). */
type NonUndefined<T> = T extends undefined ? never : T

/**
 * Computes the merged request type based on which optional fields are required.
 * @internal
 */
type MergedRequest<
  config extends MethodIntent.Config,
  mode extends 'input' | 'output' = 'output',
> = {
  [key in RequiredKeys<config['requestSchema']>]: Infer<config['requestSchema'][key], mode>
} & {
  [key in config['requires'] & keyof config['requestSchema']]: NonUndefined<
    Infer<config['requestSchema'][key], mode>
  >
} & {
  [key in OptionalKeys<config['requestSchema']> as key extends config['requires']
    ? never
    : key]?: Infer<config['requestSchema'][key], mode>
} & (config['methodDetails'] extends S.Schema
    ? InferObject<config['methodDetails'], mode>
    : unknown)

/** @internal */
type Infer<schema extends S.Schema, mode extends 'input' | 'output'> = mode extends 'input'
  ? S.Schema.InferInput<schema>
  : S.Schema.InferOutput<schema>

/** @internal Infers an object schema's properties with input/output mode. */
type InferObject<schema extends S.Schema, mode extends 'input' | 'output'> = mode extends 'input'
  ? S.Schema.InferInput<schema>
  : S.Schema.InferOutput<schema>

/** @internal Extracts keys where the schema output does not include undefined. */
type RequiredKeys<T extends Record<string, S.Schema>> = {
  [K in keyof T]: undefined extends S.Schema.InferOutput<T[K]> ? never : K
}[keyof T]

/** @internal Extracts keys where the schema output includes undefined. */
type OptionalKeys<T extends Record<string, S.Schema>> = {
  [K in keyof T]: undefined extends S.Schema.InferOutput<T[K]> ? K : never
}[keyof T]
