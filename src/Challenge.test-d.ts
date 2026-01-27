import { assertType, describe, expectTypeOf, test } from 'vitest'
import * as Challenge from './Challenge.js'
import * as PaymentHandler from './server/PaymentHandler.js'
import * as Intents from './tempo/Intents.js'

const handler = PaymentHandler.from({
  method: 'tempo',
  realm: 'api.example.com',
  secretKey: 'test',
  intents: {
    charge: Intents.charge,
    authorize: Intents.authorize,
  },
  async verify() {
    return {
      method: 'tempo',
      reference: '0x123',
      status: 'success' as const,
      timestamp: new Date().toISOString(),
    }
  },
})

describe('FromHandler', () => {
  test('extracts method and intent from handler', () => {
    type Result = Challenge.FromHandler<typeof handler>

    assertType<Result['method']>('tempo' as const)
    assertType<Result['intent']>('charge' as 'charge' | 'authorize')

    expectTypeOf<Result['request']>().toHaveProperty('amount')
    expectTypeOf<Result['request']>().toHaveProperty('currency')
  })
})

describe('from', () => {
  test('without handler returns generic Challenge', () => {
    const challenge = Challenge.from({
      id: 'test',
      intent: 'charge',
      method: 'tempo',
      realm: 'api.example.com',
      request: { amount: '1000' },
    })

    expectTypeOf(challenge.method).toBeString()
    expectTypeOf(challenge.intent).toBeString()
  })

  test('with handler narrows to FromHandler type', () => {
    const challenge = Challenge.from(
      {
        id: 'test',
        intent: 'charge',
        method: 'tempo',
        realm: 'api.example.com',
        request: { amount: '1000' },
      },
      { handler },
    )

    assertType<'tempo'>(challenge.method)
    assertType<'charge' | 'authorize'>(challenge.intent)
    expectTypeOf(challenge.request).toHaveProperty('amount')
    expectTypeOf(challenge.request).toHaveProperty('currency')
  })
})

describe('fromResponse', () => {
  test('without handler returns generic Challenge', () => {
    expectTypeOf(Challenge.fromResponse).parameter(0).toMatchTypeOf<Response>()
    expectTypeOf(Challenge.fromResponse).returns.toHaveProperty('method')
    expectTypeOf(Challenge.fromResponse).returns.toHaveProperty('intent')
  })

  test('with handler narrows to FromHandler type', () => {
    const fn = (r: Response) => Challenge.fromResponse(r, { handler })
    expectTypeOf(fn).returns.toMatchTypeOf<{ method: 'tempo'; intent: 'charge' | 'authorize' }>()
  })
})

describe('fromHeaders', () => {
  test('without handler returns generic Challenge', () => {
    expectTypeOf(Challenge.fromHeaders).parameter(0).toMatchTypeOf<Headers>()
    expectTypeOf(Challenge.fromHeaders).returns.toHaveProperty('method')
    expectTypeOf(Challenge.fromHeaders).returns.toHaveProperty('intent')
  })

  test('with handler narrows to FromHandler type', () => {
    const fn = (h: Headers) => Challenge.fromHeaders(h, { handler })
    expectTypeOf(fn).returns.toMatchTypeOf<{ method: 'tempo'; intent: 'charge' | 'authorize' }>()
  })
})
