import React, { Component, ComponentType } from 'react'

import { Type } from 'injection-js'
import { HoC, NullableInstanceTypes, NullableTypeMap, Subtract } from '../types'
import { createHOCName } from '../utils/helpers'
import { Inject } from './inject'

/**
 * If you need to access injected service instances outside of render, you can use this high order component.
 * It will give you also a little performance boost because providers map is gonna be created only once, during definition.
 * This can be mitigated by extracting providers to instance property when standard <Inject values={tuple(...)}/> is used.
 *
 * @param tokenMap - provider instances from injector to be mapped to wrapped component props
 */
export const withInjectables = <TokenMap extends NullableTypeMap>(
  tokenMap: TokenMap
) => <
  OriginalProps extends NullableInstanceTypes<TokenMap>,
  ResolvedProps = Subtract<OriginalProps, TokenMap>
>(
  Cmp: ComponentType<OriginalProps>
): HoC<ResolvedProps, typeof Cmp> => {
  const injectablePropsKeys: Array<keyof TokenMap> = Object.keys(tokenMap)
  const tokenRefs = injectablePropsKeys.map((propKey) => tokenMap[propKey])

  class WithInjectables extends Component<ResolvedProps> {
    static displayName: string = createHOCName(WithInjectables, Cmp)
    static readonly WrappedComponent = Cmp

    /**
     *
     * @param providersMap - map config (key to Class type)
     * @param propsKeys - array of mapped keys
     * @param injectables - injectables are nullable tuples
     */
    private injectTokensMap(
      providersMap: TokenMap,
      propsKeys: Array<keyof TokenMap>,
      injectables: NullableInstanceTypes<Array<Type<any>>>
    ) {
      const injectProps = propsKeys.reduce((acc, nextPropKey) => {
        // token is always present. We just trick TS to always be an Nullable type to get proper inference within children
        const token = providersMap[nextPropKey] as Type<any>
        const injectable =
          injectables.find(
            (injectableInstance) => injectableInstance instanceof token
          ) || null

        return { ...acc, [nextPropKey]: injectable }
      }, {}) as NullableInstanceTypes<TokenMap>

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
