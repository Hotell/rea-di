import { Injectable } from 'injection-js'

import { Stateful } from '../../services/stateful'

@Injectable()
export class Logger {
  log(...args: any[]) {
    console.log(...args)
  }
}

type State = Readonly<{
  count: number
}>

@Injectable()
export class CounterService extends Stateful<State> {
  readonly state: State = { count: 0 }

  constructor(private logger: Logger) {
    super()
  }
  inc() {
    this.logger.log('inc called')
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }
  dec() {
    this.logger.log('dec called')
    this.setState((prevState) => ({ count: prevState.count - 1 }))
  }
}
