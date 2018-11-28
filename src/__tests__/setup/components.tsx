import React, { Component, ErrorInfo, ReactChild, ReactNode } from 'react'
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

type ErrorBoundaryState = typeof errorBoundaryInitialState
const errorBoundaryInitialState = {
  hasError: false,
  error: null as null | Error,
  errorInfo: null as null | ErrorInfo,
}

export class ErrorBoundary extends Component<
  { children: ReactChild },
  ErrorBoundaryState
> {
  readonly state = errorBoundaryInitialState

  // static getDerivedStateFromError(
  //   error: any
  // ): Partial<ErrorBoundaryState> | null {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true }
  // }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // console.error('Error catched!:', error, info)
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }

    // Normally, just render children
    return this.props.children
  }
}
