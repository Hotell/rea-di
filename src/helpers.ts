import { ComponentType } from 'react'

export const getComponentDisplayName = <P>(Component: ComponentType<P>) =>
  Component.displayName ||
  Component.name ||
  (Component.constructor && Component.constructor.name) ||
  'Component'
