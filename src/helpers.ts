import { ComponentType } from 'react'

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
