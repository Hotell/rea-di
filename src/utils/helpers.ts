import { ComponentType } from 'react'

import { reflection } from '../facade/lang'
import { Constructor } from '../types'

export const getComponentDisplayName = <P>(Component: ComponentType<P>) =>
  Component.displayName ||
  Component.name ||
  (Component.constructor && Component.constructor.name) ||
  'Component'

export const createHOCName = <P>(
  Wrapper: ComponentType<any>,
  WrappedComponent: ComponentType<P>
) =>
  `${getComponentDisplayName(Wrapper)}(${getComponentDisplayName(
    WrappedComponent
  )})`

// tslint:disable-next-line:no-empty
export const noop = () => {}

export const tuple = <T extends any[]>(...args: T): T => args

export const metadataKey = '__metadata__'
export const optional = <T extends Constructor>(token: T) => {
  const withOptionalIdentity = () => token
  reflection.defineMetadata(
    metadataKey,
    { optional: true },
    withOptionalIdentity
  )

  return (withOptionalIdentity as any) as T | null
}
