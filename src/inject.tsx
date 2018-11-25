import { ReflectiveInjector } from 'injection-js'
import React, { Component, ReactNode } from 'react'

import { Context, ContextApi } from './context'
import { Constructor, InstanceTypes } from './types'

type InjectProps<C extends Constructor[]> = {
  providers: C
  children: (resolvedInjectables: InstanceTypes<C>) => ReactNode
}

export class Inject<T extends Constructor[]> extends Component<InjectProps<T>> {
  private injectMappedProviders = ({ injector }: ContextApi) => {
    const injectables = this.props.providers.map((nextInjectableRef) =>
      injector.get(nextInjectableRef)
    ) as InstanceTypes<T>

    return this.props.children(injectables)
  }
  render() {
    return <Context.Consumer>{this.injectMappedProviders}</Context.Consumer>
  }
}
