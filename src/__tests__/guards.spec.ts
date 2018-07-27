import { Provider } from 'injection-js'
import {
  isFunction,
  isJsLikeObject,
  isObject,
  isProvider,
  isType,
} from '../guards'

// tslint:disable:no-magic-numbers

jest.mock('../environment.ts', () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

// tslint:disable-next-line:no-empty
const noop = () => {}
const emptyArr = [] as any[]
const emptyObj = {}

describe(`guards`, () => {
  describe(`isJsLikeObject`, () => {
    it(`should return true if value is JS like object`, () => {
      expect(isJsLikeObject(123)).toBe(false)
      expect(isJsLikeObject('hello')).toBe(false)
      expect(isJsLikeObject(undefined)).toBe(false)
      expect(isJsLikeObject(true)).toBe(false)
      expect(isJsLikeObject(noop)).toBe(false)
      expect(isJsLikeObject(null)).toBe(false)

      expect(isJsLikeObject(emptyArr)).toBe(true)
      expect(isJsLikeObject(emptyObj)).toBe(true)
    })
  })

  describe(`isObject`, () => {
    it(`should return false if value is not an object map`, () => {
      expect(isObject(123)).toBe(false)
      expect(isObject('hello')).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(noop)).toBe(false)
      expect(isObject(emptyArr)).toBe(false)

      expect(isObject(emptyObj)).toBe(true)
      expect(isObject({ one: 1 })).toBe(true)
    })
  })

  describe(`isFunction`, () => {
    it(`should return true if value is function`, () => {
      expect(isFunction(emptyArr)).toBe(false)
      expect(isFunction(emptyObj)).toBe(false)

      expect(isFunction(noop)).toBe(true)
    })
  })

  describe(`isType`, () => {
    it(`should check if value is a class`, () => {
      expect(isType(class Test {})).toBe(true)
    })
  })

  describe(`isProvider`, () => {
    it(`should check if value is a provider config`, () => {
      class Service {}
      const providerConfig: Provider = {
        provide: Service,
        useClass: Service,
      }

      expect(isProvider(providerConfig)).toBe(true)

      expect(
        isProvider({
          useClass: Service,
        })
      ).toBe(false)
    })
  })
})
