// tslint:disable:jsx-no-lambda
import { Component, createElement, Fragment } from 'react'

import { CounterService } from './counter.service'

type Props = {
  counterService: CounterService
}
export class Counter extends Component<Props> {
  render() {
    const { counterService } = this.props

    return (
      <Fragment>
        <p>
          Open you browser devtools console... and start clicking on buttons ;)
        </p>
        <p>
          Clicked: {counterService.value} times{' '}
          <button onClick={() => counterService.onIncrement()}>+</button>{' '}
          <button onClick={() => counterService.onDecrement()}>-</button>{' '}
          <button onClick={() => counterService.incrementIfOdd()}>
            Increment if odd
          </button>{' '}
          <button onClick={() => counterService.incrementAsync()}>
            Increment async
          </button>
        </p>
      </Fragment>
    )
  }
}
