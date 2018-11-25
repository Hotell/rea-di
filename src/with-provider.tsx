import React, { Component, ComponentType } from 'react'

import { createHOCName } from './helpers'
import { Provider } from './provider'
import { HoCComponentClass, WrapperProps } from './types'

type ProvidersSetup = Provider['props']['provide']

/**
 * While this may give better performance, because provide array will be created only once,
 * prefer to use standard <Provider provide={[]}>...</Provider> within you render tree
 * @param provideConfig
 */
export const withProvider = <T extends ProvidersSetup>(provideConfig: T) => {
  return <OriginalProps extends {}>(
    Cmp: ComponentType<OriginalProps>
  ): HoCComponentClass<WrapperProps<OriginalProps, T>, typeof Cmp> => {
    class WithProvider extends Component<WrapperProps<OriginalProps, T>> {
      static displayName: string = createHOCName(WithProvider, Cmp)

      static readonly WrappedComponent = Cmp

      render() {
        const { ...rest } = this.props as object

        return (
          <Provider provide={provideConfig}>
            <Cmp {...rest} />
          </Provider>
        )
      }
    }

    return WithProvider
  }
}
