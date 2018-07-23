// tslint:disable:jsx-no-lambda
// tslint:disable:no-shadowed-variable
import { Inject } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { CounterService } from './counter.service'

import './counter.css'

export class Counter extends Component {
  render() {
    return (
      <Inject providers={{ counterService: CounterService }}>
        {({ counterService }) => (
          <div className="counter">
            <p>Clicked: {counterService.state.count} times</p>
            <p className="counter-actions">
              <button onClick={() => counterService.increment()}>+</button>
              <button onClick={() => counterService.decrement()}>-</button>
              <button onClick={() => counterService.incrementIfOdd()}>
                Increment if odd
              </button>
              <button onClick={() => counterService.incrementAsync()}>
                Increment async
              </button>
            </p>
          </div>
        )}
      </Inject>
    )
  }
}
