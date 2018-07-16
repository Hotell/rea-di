import { ReflectiveInjector } from 'injection-js'
import { createContext } from 'react'

export const rootInjector = ReflectiveInjector.resolveAndCreate([])

export type ContextApi = {
  injector: ReflectiveInjector
  [providerName: string]: any
}

export const Context: import('react').Context<ContextApi> = createContext<
  ContextApi
>({ injector: rootInjector })
