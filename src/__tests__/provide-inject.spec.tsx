// tslint:disable:no-magic-numbers
import React, { Component } from 'react'

import { mount } from 'enzyme'
import { noop } from '../helpers'
import { Inject } from '../inject'
import { Provider } from '../provider'
import { Counter } from './setup/components'
import { CounterService, Logger } from './setup/services'

class CounterModule extends Component<{ title: string }> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <Inject providers={{ logger: Logger, counterService: CounterService }}>
          {(injectables) => {
            return (
              <Counter
                counterService={injectables.counterService}
                logger={injectables.logger}
              >
                Hello projection
              </Counter>
            )
          }}
        </Inject>
      </div>
    )
  }
}

const App = () => {
  return (
    <main>
      <Provider provide={[Logger, CounterService]}>
        <CounterModule title="count module" />
      </Provider>
    </main>
  )
}

describe(`Provide/Inject`, () => {
  it(`should properly inject`, () => {
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
