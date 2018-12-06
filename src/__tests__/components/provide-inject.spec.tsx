// tslint:disable:no-magic-numbers
// tslint:disable:jsx-no-lambda
// tslint:disable:no-shadowed-variable
import React, { Component } from 'react'

import { getMetadata } from '@abraham/reflection'
import { mount } from 'enzyme'
import { Injectable, Optional } from 'injection-js'
import { Inject } from '../../components/inject'
import { DependencyProvider } from '../../components/provider'
import { metadataKey, noop, optional, tuple } from '../../utils/helpers'
import { Counter } from '../setup/components'
import { CounterService, Logger } from '../setup/services'
import { select } from '../setup/utils'

class CounterModule extends Component<{ title: string }> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <Inject values={tuple(Logger, CounterService)}>
          {(logger, counterService) => {
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
      <DependencyProvider providers={[Logger, CounterService]}>
        <CounterModule title="count module" />
      </DependencyProvider>
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
        <DependencyProvider
          providers={[{ provide: Logger, useClass: LoggerMock }]}
        >
          <div data-test="parentInjector">
            <Inject values={[Logger]}>
              {(fromParentLogger) => {
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
                    <DependencyProvider
                      providers={[{ provide: Logger, useClass: LoggerMock }]}
                    >
                      <div data-test="childInjector">
                        <Inject values={[Logger]}>
                          {(fromChildLogger) => {
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
                    </DependencyProvider>
                  </div>
                )
              }}
            </Inject>
          </div>
        </DependencyProvider>
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

  describe(`@Optional/optional()`, () => {
    @Injectable()
    class Engine {
      type?: string
    }

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

    it(`should add metadata only once via wrapper`, () => {
      expect(getMetadata(metadataKey, Engine)).toEqual(undefined)

      const DecoratedEngine = optional(Engine)
      const OriginalEngine = ((DecoratedEngine as any) as () => typeof Engine)()

      expect(getMetadata(metadataKey, DecoratedEngine!)).toEqual({
        optional: true,
      })
      expect(getMetadata(metadataKey, Engine)).toEqual(undefined)
      expect(getMetadata(metadataKey, OriginalEngine)).toEqual(undefined)
      expect(OriginalEngine).toBe(Engine)
    })

    it(`should properly resolve optional injection on component level`, () => {
      const InjectConsumer = (props: { car: Car }) => {
        return <div>{JSON.stringify(props.car)}</div>
      }

      const App = () => {
        return (
          <DependencyProvider providers={[Car]}>
            <Inject values={tuple(Car, optional(Engine))}>
              {(
                car /*$ExpectType Car*/,
                engine /* $ExpectType Engine | null*/
              ) => {
                return (
                  <div>
                    <pre>{JSON.stringify(engine)}</pre>
                    <InjectConsumer car={car} />
                  </div>
                )
              }}
            </Inject>
          </DependencyProvider>
        )
      }

      expect(() => mount(<App />)).not.toThrow()

      const tree = mount(<App />)
      expect(tree.find('pre').text()).toEqual(`null`)
      expect(tree.find(InjectConsumer).prop('car').engine).toBe(null)
    })

    it(`should properly resolve @Optional injection`, () => {
      const InjectConsumer = (props: { car: Car }) => {
        return <div>{JSON.stringify(props.car)}</div>
      }

      const App = () => {
        return (
          <DependencyProvider providers={[Car]}>
            <Inject values={[Car]}>
              {(car) => {
                return <InjectConsumer car={car} />
              }}
            </Inject>
          </DependencyProvider>
        )
      }

      const tree = mount(<App />)

      expect(tree.text()).toEqual(`{"engine":null}`)
      expect(tree.find(InjectConsumer).prop('car').engine).toBe(null)

      function willThrow() {
        const App = () => (
          <DependencyProvider providers={[CarWillCrashWithoutEngine]}>
            <Inject values={[CarWillCrashWithoutEngine]}>
              {(_) => JSON.stringify(_)}
            </Inject>
          </DependencyProvider>
        )

        mount(<App />)
      }

      expect(willThrow).toThrow(
        'No provider for Engine! (CarWillCrashWithoutEngine -> Engine)'
      )
    })
  })
})
