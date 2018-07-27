import { Type } from 'injection-js'
import { ComponentClass, ComponentType } from 'react'

export type StateCallback<T = {}> = (state: T) => Partial<T>
export type WrapperProps<
  OriginalProps extends object,
  P extends object = {}
> = Pick<OriginalProps, Exclude<keyof OriginalProps, keyof P>>

export type ProvidersMap<T = any> = { [key: string]: Type<T> }

export type HoCComponentClass<P, O extends ComponentType<any>> = ComponentClass<
  P
> & {
  WrappedComponent: O
}
