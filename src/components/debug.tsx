import {
  Provider as ProviderConfig,
  ReflectiveInjector,
  Type,
} from 'injection-js'
import React, { ReactElement, ReactNode } from 'react'

import { rootInjector } from '../services/injector-context'
import { isProvider, isType } from '../utils/guards'

export const Debug = (props: {
  enable: boolean
  parentInjector: ReflectiveInjector
  children: ReactNode
  registeredProviders: ProviderConfig[]
  label?: string
}) => {
  const { children, enable, label, registeredProviders, parentInjector } = props

  if (!enable) {
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
