import { Injectable, InjectionToken, Optional, Inject } from 'injection-js'

import { CounterService } from './counter.service'
import { Logger } from './logger.service'
import { getClassName } from './helpers'

const defaultConfig = {
  multiplyBy: 2,
}
export type MultiplyCounterConfig = typeof defaultConfig
export const MultiplyCounterConfig = new InjectionToken('MultiplyCounterConfig')

@Injectable()
export class MultiplyCounterService extends CounterService {
  constructor(
    @Optional()
    @Inject(MultiplyCounterConfig)
    private config: MultiplyCounterConfig,
    public logger: Logger
  ) {
    super(logger)
    this.config = config || defaultConfig
  }
  onIncrement() {
    this.setState((prevState) => {
      const newCount =
        prevState.count === 0
          ? (prevState.count + 1) * this.config.multiplyBy
          : prevState.count * this.config.multiplyBy

      return { count: newCount }
    })

    this.logger.log(
      `${getClassName(this)}: increment called and count set to: ${
        this.state.count
      }`
    )
  }

  onDecrement() {
    this.setState((prevState) => ({
      count: prevState.count / this.config.multiplyBy,
    }))
    this.logger.log(
      `${getClassName(this)}: decrement called and count set to: ${
        this.state.count
      }`
    )
  }
}
