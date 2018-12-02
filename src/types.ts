import { Type } from 'injection-js'
import { ComponentClass, ComponentType } from 'react'

export type StateCallback<T = {}> = (state: T) => Partial<T>

export type TypeMap<
  T extends { [key: string]: Type<any> } = { [key: string]: Type<any> }
> = { [K in keyof T]: T[K] }
export type NullableTypeMap<
  T extends { [key: string]: Type<any> | null } = {
    [key: string]: Type<any> | null
  }
> = { [K in keyof T]: T[K] | null }

export type StringMap<T> = { [key: string]: T }

export type Values<T extends object> = T extends { [k: string]: infer V }
  ? V
  : never

export type HoC<
  P,
  OriginalComponent extends ComponentType<any>
> = ComponentClass<P> & {
  WrappedComponent: OriginalComponent
}

export type InstanceTypes<T> = {
  [P in keyof T]: T[P] extends Constructor<infer U> ? U : any
}

export type NullableInstanceTypes<T> = {
  [P in keyof T]: T[P] extends Constructor<infer U>
    ? U
    : T[P] extends Constructor<infer I> | null
    ? I | null
    : any
}

export type Constructor<T = {}> = new (...args: any[]) => T

export type Nullable<T> = T extends null | undefined ? T : never

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
export type Subtract<T, K> = Omit<T, keyof K>
