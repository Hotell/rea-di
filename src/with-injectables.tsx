import React, { Component, ComponentType } from 'react'

import { createHOCName } from './helpers'
import { Inject } from './inject'
import {
  Constructor,
  HoCComponentClass,
  InstanceTypes,
  Subtract,
} from './types'

type InjectedProps<T extends Constructor[] = Constructor[]> = {
  injectables: InstanceTypes<T>
}

/**
 * If you need to access injected service instances outside of render, you can use this high order component.
 * It will give you also a little performance boost because providers map is gonna be created only once, during definition.
 * This can be mitigated by extracting providers to instance property when standard <Inject provide={{...}}/> is used.
 * @param providers
 */
export const withInjectables = <T extends Constructor[]>(providers: T) => {
  return <OriginalProps extends InjectedProps<T>>(
    Cmp: ComponentType<OriginalProps>
  ): HoCComponentClass<
    Subtract<OriginalProps, InjectedProps<T>>,
    typeof Cmp
  > => {
    class WithInjectables extends Component<
      Subtract<OriginalProps, InjectedProps<T>>
    > {
      static displayName: string = createHOCName(WithInjectables, Cmp)
      static readonly WrappedComponent = Cmp
      render() {
        const { ...rest } = this.props as object

        return (
          <Inject values={providers}>
            {(injectables) => <Cmp injectables={injectables} {...rest} />}
          </Inject>
        )
      }
    }

    return WithInjectables
  }
}
