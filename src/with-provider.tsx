import React, { Component, ComponentType } from 'react'

import { createHOCName } from './helpers'
import { DependencyProvider } from './provider'
import { HoC, Subtract } from './types'

type ProvidersSetup = DependencyProvider['props']['providers']

/**
 * While this may give better performance, because provide array will be created only once,
 * prefer to use standard <DependencyProvider providers={[]}>...</DependencyProvider> within you render tree
 *
 * @param providers - providers configuration to be registered within injector
 */
export const withDependencyProvider = <T extends ProvidersSetup>(
  ...providers: T
) => <OriginalProps extends object, ResolvedProps = Subtract<OriginalProps, T>>(
  Cmp: ComponentType<OriginalProps>
): HoC<ResolvedProps, typeof Cmp> => {
  class WithDependencyProvider extends Component<ResolvedProps> {
    static displayName: string = createHOCName(WithDependencyProvider, Cmp)

    static readonly WrappedComponent = Cmp

    render() {
      const { ...rest } = this.props as object /* FIXED in ts 3.2 */

      return (
        <DependencyProvider providers={providers}>
          <Cmp {...rest} />
        </DependencyProvider>
      )
    }
  }

  return WithDependencyProvider
}
