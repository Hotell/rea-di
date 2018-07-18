import { Injectable } from 'injection-js'
import { WithState } from '@martin_hotell/rea-di'

type State = Readonly<typeof initialState>
const initialState = {
  count: 0,
}

@Injectable()
export class CounterService extends WithState<State> {
  readonly state = initialState

  get value() {
    return this.state.count
  }

  onIncrement() {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }
  onDecrement() {
    this.setState((prevState) => ({ count: prevState.count - 1 }))
  }
  incrementIfOdd() {
    if (this.state.count % 2 !== 0) {
      this.onIncrement()
    }
  }

  incrementAsync() {
    setTimeout(() => this.onIncrement(), 1000)
  }
}
