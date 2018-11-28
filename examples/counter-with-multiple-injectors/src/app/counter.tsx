// tslint:disable:jsx-no-lambda

import { Inject } from '@martin_hotell/rea-di'
import { Component, createElement, Fragment } from 'react'

import { CounterService } from './counter.service'

type Props = {}
export class Counter extends Component<Props> {
  render() {
    return (
      <Inject values={[CounterService]}>
        {(counterService) => (
          <Fragment>
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
        )}
      </Inject>
    )
  }
}
