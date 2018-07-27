import { Provider, Type, TypeProvider } from 'injection-js'

export const isJsLikeObject = <T extends object>(value: any): value is T =>
  value !== null && typeof value === 'object'
export const isBlank = <T>(
  value: any
): value is T extends undefined | null ? T : never => value == null

export const isPresent = <T>(
  value: any
): value is T extends undefined | null ? never : T => value != null

export const isArray = <T>(value: any): value is Array<any> =>
  Array.isArray(value)

// tslint:disable-next-line:ban-types
export const isFunction = <T extends Function>(value: any): value is T =>
  typeof value === 'function'

export const isString = <T>(value: T): value is T extends string ? T : never =>
  typeof value === 'string'

export const isObject = <T>(value: T): value is T extends object ? T : never =>
  isPresent(value) && isJsLikeObject(value) && !isArray(value)

// library specific guards

export const isType = <T extends {}>(value: any): value is Type<T> =>
  isFunction(value)

export const isProvider = (
  value: any
): value is Exclude<Provider, TypeProvider | any[]> => {
  return isPresent(value) && isObject(value) && 'provide' in value
}
