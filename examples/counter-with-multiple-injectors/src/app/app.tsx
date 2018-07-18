import { Provider } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { CounterService } from './counter.service'
import { Counter } from './counter'
import { Logger } from './logger.service'
import {
  MultiplyCounterService,
  MultiplyCounterConfig,
} from './multiply-counter.service'
import { EnhancedLogger } from './enhanced-logger.service'

export class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Counter app</h1>
        <p>
          Open you browser devtools console... and start clicking on buttons ;)
        </p>
        <Provider provide={[CounterService, Logger]}>
          <h2>Counter component with CounterService instance</h2>
          <Counter />

          <hr />

          <Provider
            provide={[
              { provide: CounterService, useClass: MultiplyCounterService },
              { provide: Logger, useClass: EnhancedLogger },
            ]}
          >
            <h2>
              Counter component with MultiplyCounterService instance
              <small>multiply by 2 and uses enhanced logger</small>
            </h2>
            <Counter />
          </Provider>

          <hr />

          <Provider
            provide={[
              { provide: MultiplyCounterConfig, useValue: { multiplyBy: 4 } },
              { provide: CounterService, useClass: MultiplyCounterService },
            ]}
          >
            <h2>
              Counter component with MultiplyCounterService instance
              <small>multiply by 4</small>
            </h2>
            <Counter />
          </Provider>
        </Provider>
      </div>
    )
  }
}
