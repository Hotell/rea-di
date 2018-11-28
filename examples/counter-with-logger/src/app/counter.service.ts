import { Stateful } from '@martin_hotell/rea-di'
import { Injectable } from 'injection-js'

import { Logger } from './logger.service'

type State = Readonly<typeof initialState>
const initialState = {
  count: 0,
}

@Injectable()
export class CounterService extends Stateful<State> {
  readonly state = initialState

  constructor(private logger: Logger) {
    super()
  }

  get value() {
    return this.state.count
  }

  onIncrement() {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
    this.logger.log(
      `CounterService: increment called and count set to: ${this.state.count}`
    )
  }
  onDecrement() {
    this.setState((prevState) => ({ count: prevState.count - 1 }))
    this.logger.log(
      `CounterService: decrement called and count set to: ${this.state.count}`
    )
  }
  incrementIfOdd() {
    const ODD_NUMBER = 2
    if (this.state.count % ODD_NUMBER !== 0) {
      this.onIncrement()

      return
    }

    this.logger.warn(
      `CounterService: count is not Odd number, skipping state increment!`
    )
  }

  incrementAsync() {
    const DELAY = 1000
    this.logger.warn(`CounterService: I'll increment state after 1 second !`)
    setTimeout(() => this.onIncrement(), DELAY)
  }
}
