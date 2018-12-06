import {
  Provider as ProviderConfig,
  ReflectiveInjector,
  Type,
} from 'injection-js'
import React, { PureComponent, ReactElement } from 'react'

import { IS_PROD } from '../environment'
import { Context, ContextApi } from '../services/injector-context'
import { StateCallback } from '../types'
import { isProvider, isType } from '../utils/guards'
import { Debug } from './debug'

type Props = {
  children: ReactElement<any>
  providers: ProviderConfig[]
}
type State = ContextApi

/**
 *
 */
export class DependencyProvider extends PureComponent<Props, State> {
  private static _debugMode = {
    on: false,
  }
  static enableDebugMode() {
    if (IS_PROD) {
      // tslint:disable-next-line:no-console
      console.info('👉 DEBUG MODE IS AVAILABLE ONLY IN NON PROD ENV')

      return
    }

    this._debugMode.on = true
  }

  private injector?: ReflectiveInjector
  readonly state: State = {} as State
  private providersRegistered = false

  private monkeyPatchStateProviders(
    injector: ReflectiveInjector,
    providers: ProviderConfig[]
  ) {
    type TypeWithState = Type<any> & { setState(...args: any[]): any }

    providers.reduce((acc, next) => {
      let stateKey: string
      let provideClass!: TypeWithState
      if (isType(next)) {
        stateKey = next.name
        provideClass = next as TypeWithState
      }
      if (isProvider(next)) {
        const { provide } = next
        stateKey = provide.name
        provideClass = provide
      }

      const hasState =
        isType(provideClass) && 'setState' in provideClass.prototype

      if (hasState) {
        const instance = injector.get(provideClass)
        const originalSetStateFn = instance.setState.bind(instance)

        const newSetStateFn = (state: StateCallback) => {
          // call service setState
          const newState = originalSetStateFn(state) as object

          // update context provider state
          this.setState(
            (prevState) => {
              return { [stateKey]: newState }
            }
            // () => originalSetStateFn(state)
          )
        }

        instance.setState = newSetStateFn
      }

      return acc
    }, {})
  }

  private get contextApi(): ContextApi {
    return {
      injector: this.injector,
      ...this.state,
    }
  }
  private renderProvider = ({ injector: parentInjector }: ContextApi) => {
    const isInDebugMode = !IS_PROD && DependencyProvider._debugMode.on

    this.injector =
      this.injector ||
      parentInjector.resolveAndCreateChild(this.props.providers)

    if (!this.providersRegistered) {
      this.monkeyPatchStateProviders(this.injector, this.props.providers)
    }

    this.providersRegistered = true

    if (isInDebugMode) {
      return (
        <Context.Provider value={this.contextApi}>
          <Debug
            enable
            parentInjector={parentInjector}
            registeredProviders={this.props.providers}
          >
            {this.props.children}
          </Debug>
        </Context.Provider>
      )
    }

    return (
      <Context.Provider value={this.contextApi}>
        {this.props.children}
      </Context.Provider>
    )
  }

  render() {
    return <Context.Consumer>{this.renderProvider}</Context.Consumer>
  }
}
