import { describe, expectTypeOf, test } from 'vitest'
import * as Credential from '../Credential.js'
import * as Intent from '../Intent.js'
import * as Method from '../Method.js'
import * as MethodIntent from '../MethodIntent.js'
import * as z from '../zod.js'
import * as Mpay from './Mpay.js'

const fooCharge = MethodIntent.fromIntent(Intent.charge, {
  method: 'test',
  schema: {
    credential: {
      payload: z.object({ signature: z.string() }),
    },
    request: {
      requires: ['recipient'],
    },
  },
})

const fooMethod = Method.from({
  name: 'test',
  intents: { charge: fooCharge },
})

const clientMethod = Method.toClient(fooMethod, {
  async createCredential({ challenge }) {
    return Credential.serialize({
      challenge,
      payload: { signature: '0xtest' },
    })
  },
})

describe('Mpay', () => {
  test('has methods array', () => {
    const mpay = Mpay.create({ methods: [clientMethod] })

    expectTypeOf(mpay.methods).toMatchTypeOf<readonly unknown[]>()
    expectTypeOf(mpay.methods[0]?.name).toEqualTypeOf<'test'>()
  })

  test('has createCredential function', () => {
    const mpay = Mpay.create({ methods: [clientMethod] })

    expectTypeOf(mpay.createCredential).toBeFunction()
    expectTypeOf(mpay.createCredential).parameters.toMatchTypeOf<[Response]>()
    expectTypeOf(mpay.createCredential).returns.toMatchTypeOf<Promise<string>>()
  })
})

describe('create.Config', () => {
  test('requires methods array', () => {
    type Config = Mpay.create.Config

    expectTypeOf<Config>().toHaveProperty('methods')
  })
})

describe('Method.toClient', () => {
  test('createCredential receives typed challenge', () => {
    Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        expectTypeOf(challenge.method).toBeString()
        expectTypeOf(challenge.intent).toBeString()
        expectTypeOf(challenge.request).toHaveProperty('amount')
        expectTypeOf(challenge.request).toHaveProperty('currency')
        expectTypeOf(challenge.request).toHaveProperty('recipient')

        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest' },
        })
      },
    })
  })

  test('returns Client type', () => {
    const client = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest' },
        })
      },
    })

    expectTypeOf(client.name).toEqualTypeOf<'test'>()
    expectTypeOf(client.intents).toHaveProperty('charge')
    expectTypeOf(client.createCredential).toBeFunction()
  })
})
