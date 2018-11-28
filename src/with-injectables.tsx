import React, { Component, ComponentType } from 'react'

import { Type } from 'injection-js'
import { createHOCName } from './helpers'
import { Inject } from './inject'
import { HoC, InstanceTypes, Subtract, TypeMap } from './types'

/**
 * If you need to access injected service instances outside of render, you can use this high order component.
 * It will give you also a little performance boost because providers map is gonna be created only once, during definition.
 * This can be mitigated by extracting providers to instance property when standard <Inject values={tuple(...)}/> is used.
 *
 * @param tokenMap - provider instances from injector to be mapped to wrapped component props
 */
export const withInjectables = <TokenMap extends TypeMap>(
  tokenMap: TokenMap
) => <
  OriginalProps extends InstanceTypes<TokenMap>,
  ResolvedProps = Subtract<OriginalProps, TokenMap>
>(
  Cmp: ComponentType<OriginalProps>
): HoC<ResolvedProps, typeof Cmp> => {
  const injectablePropsKeys: Array<keyof TokenMap> = Object.keys(tokenMap)
  const tokenRefs = injectablePropsKeys.map((propKey) => tokenMap[propKey])

  class WithInjectables extends Component<ResolvedProps> {
    static displayName: string = createHOCName(WithInjectables, Cmp)
    static readonly WrappedComponent = Cmp

    private injectTokensMap(
      providersMap: TokenMap,
      propsKeys: Array<keyof TokenMap>,
      injectables: InstanceTypes<Type<any>[]>
    ) {
      const injectProps = propsKeys.reduce((acc, nextPropKey) => {
        const token = providersMap[nextPropKey]
        const injectable =
          injectables.find((injectableInstance) => {
            return injectableInstance instanceof token
          }) || null

        return { ...acc, [nextPropKey]: injectable }
      }, {}) as InstanceTypes<TokenMap>

      return injectProps
    }

    render() {
      const { ...rest } = this.props as object /* FIXED in ts 3.2 */

      return (
        <Inject values={tokenRefs}>
          {(...injectables) => (
            <Cmp
              {...this.injectTokensMap(
                tokenMap,
                injectablePropsKeys,
                injectables
              )}
              {...rest}
            />
          )}
        </Inject>
      )
    }
  }

  return WithInjectables
}
