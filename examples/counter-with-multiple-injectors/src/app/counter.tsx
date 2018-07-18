import React, { Component } from 'react'
import { Inject } from '@martin_hotell/rea-di'

import { CounterService } from './counter.service'

type Props = {}
export class Counter extends Component<Props> {
  render() {
    return (
      <Inject providers={{ counterService: CounterService }}>
        {({ counterService }) => (
          <>
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
          </>
        )}
      </Inject>
    )
  }
}
