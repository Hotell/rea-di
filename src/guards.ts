import { Provider, Type, TypeProvider } from 'injection-js'

import { Nullable } from './types'

export const isBlank = <T>(value: T): value is Nullable<T> => value == null

export const isPresent = <T>(value: T): value is NonNullable<T> => value != null

// tslint:disable-next-line:ban-types
export const isFunction = (value: any): value is Function =>
  typeof value === 'function'

export const isString = (value: any): value is string =>
  typeof value === 'string'

export const isJsLikeObject = <T extends object>(value: any): value is T =>
  isPresent(value) && typeof value === 'object'

export const isArray = <T>(value: any): value is Array<T> =>
  Array.isArray(value)

export const isObject = <T>(value: T): value is T extends object ? T : never =>
  isJsLikeObject(value) && !isArray(value)

// =======================
// library specific guards
// =======================

// @TODO create PR to expose this API - injection-js
export const isType = <T extends {}>(value: any): value is Type<T> =>
  isFunction(value)

export const isProvider = (
  value: any
): value is Exclude<Provider, TypeProvider | any[]> => {
  return isPresent(value) && isObject(value) && 'provide' in value
}
