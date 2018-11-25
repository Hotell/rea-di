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

export type InstanceTypes<T> = {
  [P in keyof T]: T[P] extends Constructor<infer U> ? U : never
}

export type Constructor<T = {}> = new (...args: any[]) => T

export type Nullable<T> = T extends null | undefined ? T : never

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
export type Subtract<T, K> = Omit<T, keyof K>
