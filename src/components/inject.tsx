import React, { Component, ReactNode } from 'react'

import { reflection } from '../facade/lang'
import { Context, ContextApi } from '../services/injector-context'
import { Constructor, NullableInstanceTypes } from '../types'
import { metadataKey } from '../utils/helpers'

type InjectProps<C extends Array<Constructor | null>> = {
  values: C
  children: (...injectables: NullableInstanceTypes<C>) => ReactNode
}

export class Inject<T extends Array<Constructor | null>> extends Component<
  InjectProps<T>
> {
  private injectMappedProviders = ({ injector }: ContextApi) => {
    const injectables = this.props.values.map((nextInjectableRef) => {
      if (!nextInjectableRef) {
        return null
      }

      const annotationsMeta = reflection.getMetadata(
        metadataKey,
        nextInjectableRef
      ) as undefined | { optional: boolean }

      if (!annotationsMeta) {
        return injector.get(nextInjectableRef)
      }

      const isOptional = annotationsMeta && annotationsMeta.optional
      const notFoundValue = isOptional ? null : undefined
      const wrappedInjectableRef = ((nextInjectableRef as any) as () => Constructor)()

      return injector.get(wrappedInjectableRef, notFoundValue)
    }) as NullableInstanceTypes<T>

    return this.props.children(...(injectables as any))
  }
  render() {
    return <Context.Consumer>{this.injectMappedProviders}</Context.Consumer>
  }
}
