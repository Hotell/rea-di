// tslint:disable:no-magic-numbers
import { Stateful } from '@martin_hotell/rea-di'
import { Injectable } from 'injection-js'

type State = Readonly<typeof initialState>

const initialState = {
  count: 0,
}

@Injectable()
export class CounterService extends Stateful<State> {
  readonly state = initialState

  increment() {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }
  decrement() {
    this.setState((prevState) => ({ count: prevState.count - 1 }))
  }
  incrementIfOdd() {
    if (this.state.count % 2 !== 0) {
      this.increment()
    }
  }
  incrementAsync() {
    setTimeout(() => this.increment(), 1000)
  }
}
