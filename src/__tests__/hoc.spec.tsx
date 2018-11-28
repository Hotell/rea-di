// tslint:disable:no-magic-numbers
// tslint:disable:no-use-before-declare

import { mount } from 'enzyme'
import React, { Component } from 'react'

import { ReflectiveInjector } from 'injection-js'
import { noop } from '../helpers'
import { withInjectables } from '../with-injectables'
import { withDependencyProvider } from '../with-provider'
import { Counter } from './setup/components'
import { CounterService, Logger } from './setup/services'

class CounterModule extends Component<{ title: string }> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <CounterEnhanced>Hello projection</CounterEnhanced>
      </div>
    )
  }
}
const CounterModuleEnhanced = withDependencyProvider(Logger, CounterService)(
  CounterModule
)

const CounterEnhanced = withInjectables({
  logger: Logger,
  counterService: CounterService,
})(Counter)

const App = () => {
  return (
    <main>
      <CounterModuleEnhanced title="count module" />
    </main>
  )
}

describe('Hoc wrappers', () => {
  it(`should work with HoC`, () => {
    const tree = mount(<App />)

    const counter = tree.find(Counter)
    const counterChildren = counter.prop('children')

    expect(counterChildren!.toString()).toBe('Hello projection')

    expect(tree).toBeTruthy()
    expect(tree).toMatchSnapshot()

    tree.unmount()
  })

  it(`should properly update state on stateful service and reflect it on component tree`, () => {
    const tree = mount(<App />)

    const counter = tree.find(Counter)
    const counterLogger = counter.props().logger
    const incButton = counter.find('button').at(0)
    const decButton = counter.find('button').at(1)
    const countParagraph = counter.find('p')

    jest.spyOn(counterLogger, 'log').mockImplementation(noop)

    expect(countParagraph.text()).toBe('Count: 0')
    expect(counterLogger.log).not.toHaveBeenCalled()

    incButton.simulate('click')

    expect(countParagraph.text()).toBe('Count: 1')
    expect(counterLogger.log).toHaveBeenCalledTimes(1)

    decButton.simulate('click')
    decButton.simulate('click')

    expect(countParagraph.text()).toBe('Count: -1')
    expect(counterLogger.log).toHaveBeenCalledTimes(3)

    tree.unmount()
  })

  it(`should should return wrapped component with proper prop annotation`, () => {
    const injector = ReflectiveInjector.resolveAndCreate([
      Logger,
      CounterService,
    ])
    const logger: Logger = injector.get(Logger)
    const counter: CounterService = injector.get(CounterService)

    expect(CounterModuleEnhanced.WrappedComponent).toBe(CounterModule)
    expect(CounterEnhanced.WrappedComponent).toBe(Counter)

    expect(
      <CounterModuleEnhanced.WrappedComponent title="Hello" />
    ).toMatchSnapshot()
    expect(
      <CounterEnhanced.WrappedComponent
        logger={logger}
        counterService={counter}
      />
    ).toMatchSnapshot()
  })

  it(`should should create proper displayName`, () => {
    expect(CounterModuleEnhanced.displayName).toBe(
      'WithDependencyProvider(CounterModule)'
    )
    expect(CounterEnhanced.displayName).toBe('WithInjectables(Counter)')
  })
})
