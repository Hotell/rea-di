import { Type } from 'injection-js'

export type StateCallback<T = {}> = (state: T) => Partial<T>
export type WrapperProps<
  OriginalProps extends object,
  P extends object = {}
> = Pick<OriginalProps, Exclude<keyof OriginalProps, keyof P>>

export type ProvidersMap<T = any> = { [key: string]: Type<T> }
