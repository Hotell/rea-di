import {
  Provider as ProviderConfig,
  ReflectiveInjector,
  Type,
} from 'injection-js'
import React, { PureComponent, ReactElement, ReactNode } from 'react'

import { Context, ContextApi, rootInjector } from './context'
import { isProvider, isType } from './guards'
import { StateCallback } from './types'

const Debug = (props: {
  parentInjector: ReflectiveInjector
  children: ReactNode
  registeredProviders: ProviderConfig[]
  label?: string
}) => {
  const { children, label, registeredProviders, parentInjector } = props

  // tslint:disable-next-line:no-use-before-declare
  if (!Provider._debugMode.on) {
    return children as ReactElement<any>
  }

  const isRoot = parentInjector === rootInjector
  const injectorLabel = label || isRoot ? 'Root Injector' : 'Child Injector'
  const bgColor = isRoot ? 'red' : '#388e3c'
  const styling = {
    container: { border: `2px solid ${bgColor}`, padding: '.5rem' },
    header: { backgroundColor: bgColor, padding: `.5rem .25rem` },
    title: { margin: 0, backgroundColor: bgColor },
  }

  const registeredProvidersNames: string[] = getRegisteredProvidersNames(
    registeredProviders
  )

  return (
    <div style={styling.container}>
      <header style={styling.header}>
        <h4 style={styling.title}>{injectorLabel}</h4>
        <pre>
          <b>Registered Providers:</b> {json(registeredProvidersNames)}
        </pre>
      </header>
      {children}
    </div>
  )

  function json<T>(value: T) {
    // tslint:disable-next-line:no-magic-numbers
    return JSON.stringify(value, null, 2)
  }

  function getRegisteredProvidersNames(providers: ProviderConfig[]): string[] {
    return providers.reduce((acc, next) => {
      if (isType(next)) {
        return [...(acc as string[]), next.name]
      }

      if (isProvider(next)) {
        const [registrationKey] = Object.keys(next).filter(
          (val) => val !== 'provide'
        )

        const registrationValue = (next as {
          [key: string]: any
        })[registrationKey] as Type<any> | object

        const providerName = {
          provide: next.provide.name ? next.provide.name : next.provide._desc,
          as: isType(registrationValue)
            ? registrationValue.name
            : JSON.stringify(registrationValue),
        }

        return [
          ...(acc as string[]),
          `{provide: ${providerName.provide}, ${registrationKey}: ${
            providerName.as
          } }`,
        ]
      }

      return acc
    }, []) as string[]
  }
}

type Props = {
  children: ReactElement<any>
  provide: ProviderConfig[]
}
type State = ContextApi

/**
 *
 */
export class Provider extends PureComponent<Props, State> {
  static _debugMode = {
    on: false,
  }
  static enableDebugMode() {
    this._debugMode.on = true
  }
  private static Debug = Debug

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
        // console.log('HAS STATE')
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
    this.injector =
      this.injector || parentInjector.resolveAndCreateChild(this.props.provide)

    if (!this.providersRegistered) {
      this.monkeyPatchStateProviders(this.injector, this.props.provide)
    }

    this.providersRegistered = true

    if (Provider._debugMode.on) {
      return (
        <Context.Provider value={this.contextApi}>
          <Provider.Debug
            parentInjector={parentInjector}
            registeredProviders={this.props.provide}
          >
            {this.props.children}
          </Provider.Debug>
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
