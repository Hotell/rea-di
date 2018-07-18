import React, { Component } from 'react'

import { CounterService } from './counter.service'

type Props = {
  counterService: CounterService
}
export class Counter extends Component<Props> {
  render() {
    const { counterService } = this.props

    return (
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
    )
  }
}
