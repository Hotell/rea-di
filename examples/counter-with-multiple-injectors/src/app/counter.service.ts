import { Injectable } from 'injection-js'
import { WithState } from '@martin_hotell/rea-di'

import { Logger } from './logger.service'
import { getClassName } from './helpers'

type State = Readonly<typeof initialState>
const initialState = {
  count: 0,
}

@Injectable()
export class CounterService extends WithState<State> {
  readonly state = initialState

  constructor(public logger: Logger) {
    super()
  }

  get value() {
    return this.state.count
  }

  onIncrement() {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
    this.logger.log(
      `${getClassName(this)}: increment called and count set to: ${
        this.state.count
      }`
    )
  }
  onDecrement() {
    this.setState((prevState) => ({ count: prevState.count - 1 }))
    this.logger.log(
      `${getClassName(this)}: decrement called and count set to: ${
        this.state.count
      }`
    )
  }
  incrementIfOdd() {
    if (this.state.count % 2 !== 0) {
      this.onIncrement()
      return
    }

    this.logger.warn(
      `${getClassName(
        this
      )}: count is not Odd number, skipping state increment!`
    )
  }

  incrementAsync() {
    this.logger.warn(
      `${getClassName(this)}: I'll increment state after 1 second !`
    )
    setTimeout(() => this.onIncrement(), 1000)
  }
}
