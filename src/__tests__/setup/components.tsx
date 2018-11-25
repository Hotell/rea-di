import React, { Component, ReactNode } from 'react'
import { CounterService, Logger } from './services'

export class Counter extends Component<{
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
    const { logger } = this.props

    logger.log('Counter Logged')
  }
}

export class CounterForHoc extends Component<{
  injectables: [Logger, CounterService]
  children?: ReactNode
}> {
  render() {
    // tslint:disable:jsx-no-lambda
    const {
      injectables: [, counterService],
      children,
    } = this.props

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
    const {
      injectables: [logger],
    } = this.props

    logger.log('Counter Logged')
  }
}
