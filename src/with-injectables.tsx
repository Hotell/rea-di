import React, { Component, ComponentType } from 'react'

import { getComponentDisplayName } from './helpers'
import { Inject } from './inject'
import { ProvidersMap, WrapperProps } from './types'

/**
 * If you need to access injected service instances outside of render, you can use this high order component.
 * It will give you also a little performance boost because providers map is gonna be created only once, during definition.
 * This can be mitigated by extracting providers to instance property when standard <Inject provide={{...}}/> is used.
 * @param providers
 */
export const withInjectables = <T extends ProvidersMap>(providers: T) => {
  return <OriginalProps extends {}>(
    Cmp: ComponentType<OriginalProps>
  ): ComponentType<WrapperProps<OriginalProps, T>> => {
    class WithInjectables extends Component<WrapperProps<OriginalProps, T>> {
      static displayName = `WithInjectables(${getComponentDisplayName(Cmp)})`
      static readonly WrappedComponent = Cmp
      render() {
        const { ...rest } = this.props as object

        return (
          <Inject providers={providers}>
            {(injectables) => <Cmp {...injectables} {...rest} />}
          </Inject>
        )
      }
    }

    return WithInjectables
  }
}
