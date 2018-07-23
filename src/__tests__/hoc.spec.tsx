// tslint:disable:no-magic-numbers
// tslint:disable:no-use-before-declare

import { mount } from 'enzyme'
import { Injectable } from 'injection-js'
import React, { Component, ReactNode } from 'react'

import { withInjectables } from '../with-injectables'
import { withProvider } from '../with-provider'
import { WithState } from '../with-state'

// tslint:disable-next-line:no-empty
const noop = () => {}

@Injectable()
class Logger {
  log(...args: any[]) {
    console.log(...args)
  }
}

type State = Readonly<{
  count: number
}>

@Injectable()
class CounterService extends WithState<State> {
  readonly state: State = { count: 0 }

  constructor(private logger: Logger) {
    super()
  }
  inc() {
    this.logger.log('inc called')
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }
  dec() {
    this.logger.log('dec called')
    this.setState((prevState) => ({ count: prevState.count - 1 }))
  }
}

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
const CounterModuleEnhanced = withProvider({
  provide: [Logger, CounterService],
})(CounterModule)

class Counter extends Component<{
  counterService: CounterService
  logger: Logger
  children?: ReactNode
}> {
  render() {
    // tslint:disable:jsx-no-lambda
    const { counterService, children } = this.props

    return (
      <div className="counter">
        <h4>Counter</h4>
        <p>Count: {counterService.state.count}</p>
        <button onClick={() => counterService.inc()}>increment</button>
        <button onClick={() => counterService.dec()}>decrement</button>
        <section className="children-section">{children}</section>
      </div>
    )
  }
  componentDidMount() {
    this.props.logger.log('Counter Logged')
  }
}
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
})
