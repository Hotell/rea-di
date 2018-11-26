// tslint:disable:no-magic-numbers
// tslint:disable:jsx-no-lambda
// tslint:disable:no-shadowed-variable
import React, { Component } from 'react'

import { mount } from 'enzyme'
import { Injectable, Optional } from 'injection-js'
import { noop, tuple } from '../helpers'
import { Inject } from '../inject'
import { Provider } from '../provider'
import { Counter } from './setup/components'
import { CounterService, Logger } from './setup/services'
import { select } from './setup/utils'

class CounterModule extends Component<{ title: string }> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <Inject providers={tuple(Logger, CounterService)}>
          {([logger, counterService]) => {
            return (
              <Counter counterService={counterService} logger={logger}>
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

  it(`should properly create hierarchical injectors`, () => {
    class LoggerMock implements Logger {
      log = jest.fn((...args: any[]) => void 0)
    }
    // tslint:disable:prefer-const
    let parentLoggerInstance!: LoggerMock
    let childLoggerInstance!: LoggerMock

    const App = () => {
      return (
        <Provider provide={[{ provide: Logger, useClass: LoggerMock }]}>
          <div data-test="parentInjector">
            <Inject providers={[Logger]}>
              {([fromParentLogger]) => {
                parentLoggerInstance = fromParentLogger as LoggerMock

                return (
                  <div>
                    <button
                      onClick={() => {
                        fromParentLogger.log('from parent')
                      }}
                    >
                      log from parent
                    </button>
                    <Provider
                      provide={[{ provide: Logger, useClass: LoggerMock }]}
                    >
                      <div data-test="childInjector">
                        <Inject providers={[Logger]}>
                          {([fromChildLogger]) => {
                            childLoggerInstance = fromChildLogger as LoggerMock

                            return (
                              <div>
                                <button
                                  onClick={() => {
                                    fromParentLogger.log('parent from child')
                                  }}
                                >
                                  log parent from child
                                </button>
                                <button
                                  onClick={() => {
                                    fromChildLogger.log('from child')
                                  }}
                                >
                                  log from child
                                </button>
                              </div>
                            )
                          }}
                        </Inject>
                      </div>
                    </Provider>
                  </div>
                )
              }}
            </Inject>
          </div>
        </Provider>
      )
    }

    const tree = mount(<App />)

    const parentBtn = tree.find(`${select('parentInjector')} button`).at(0)
    const childrenButtons = tree.find(`${select('childInjector')} button`)
    const childrenBtnThatLogsParent = childrenButtons.at(0)
    const childrenBtnThatLogsChild = childrenButtons.at(1)

    expect(parentLoggerInstance.log).not.toHaveBeenCalled()

    parentBtn.simulate('click')

    expect(parentLoggerInstance.log).toHaveBeenCalledWith('from parent')

    childrenBtnThatLogsParent.simulate('click')

    expect(parentLoggerInstance.log).toHaveBeenLastCalledWith(
      'parent from child'
    )
    expect(parentLoggerInstance.log).toHaveBeenCalledTimes(2)

    expect(childLoggerInstance.log).not.toHaveBeenCalled()

    childrenBtnThatLogsChild.simulate('click')

    expect(parentLoggerInstance.log).toHaveBeenCalledTimes(2)
    expect(childLoggerInstance.log).toHaveBeenCalledTimes(1)
    expect(childLoggerInstance.log).toHaveBeenLastCalledWith('from child')
  })

  it(`should properly resolve @Optional injection`, () => {
    @Injectable()
    class Engine {}

    @Injectable()
    class Car {
      engine: Engine | null
      constructor(@Optional() engine: Engine) {
        this.engine = engine ? engine : null
      }
    }

    @Injectable()
    class CarWillCrashWithoutEngine {
      constructor(public engine: Engine) {}
    }

    const InjectConsumer = (props: { car: Car }) => {
      return <div>{JSON.stringify(props.car)}</div>
    }

    const App = () => {
      return (
        <Provider provide={[Car]}>
          <Inject providers={[Car]}>
            {([car]) => {
              return <InjectConsumer car={car} />
            }}
          </Inject>
        </Provider>
      )
    }

    const tree = mount(<App />)

    expect(tree.text()).toEqual(`{"engine":null}`)
    expect(tree.find(InjectConsumer).prop('car').engine).toBe(null)

    function willThrow() {
      const App = () => (
        <Provider provide={[CarWillCrashWithoutEngine]}>
          <Inject providers={[CarWillCrashWithoutEngine]}>
            {(_) => JSON.stringify(_)}
          </Inject>
        </Provider>
      )

      mount(<App />)
    }

    expect(willThrow).toThrow(
      'No provider for Engine! (CarWillCrashWithoutEngine -> Engine)'
    )
  })
})
