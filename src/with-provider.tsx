import { Provider as ProviderConfig } from 'injection-js'
import React, { Component, ComponentType } from 'react'

import { getComponentDisplayName } from './helpers'
import { Provider } from './provide'
import { WrapperProps } from './types'

type ProvidersSetup = { provide: ProviderConfig[] }

/**
 * While this may give better performance, because provide array will be created only once,
 * prefer to use standard <Provider provide={[]}>...</Provider> within you render tree
 * @param provideConfig
 */
export const withProvider = <T extends ProvidersSetup>(provideConfig: T) => {
  return <OriginalProps extends {}>(
    Cmp: ComponentType<OriginalProps>
  ): ComponentType<WrapperProps<OriginalProps, T>> => {
    class WithProvider extends Component<WrapperProps<OriginalProps, T>> {
      static displayName = `WithProvider(${getComponentDisplayName(Cmp)}`

      static readonly WrappedComponent = Cmp

      render() {
        const { ...rest } = this.props as object

        return (
          <Provider {...provideConfig}>
            <Cmp {...rest} />
          </Provider>
        )
      }
    }

    return WithProvider
  }
}
