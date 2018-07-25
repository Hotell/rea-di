import { Provider } from '@martin_hotell/rea-di'
import { Component, createElement } from 'react'

import { Counter } from './counter'
import { CounterService } from './counter.service'
import { EnhancedLogger } from './enhanced-logger.service'
import { Logger } from './logger.service'
import {
  MultiplyCounterConfig,
  MultiplyCounterService,
} from './multiply-counter.service'

export class App extends Component {
  render() {
    return (
      <div className="app container">
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
            <header>
              <h2>Counter component with MultiplyCounterService instance</h2>
              <h4 className="text-secondary">
                multiply by 2 and uses enhanced logger
              </h4>
            </header>
            <Counter />
          </Provider>

          <hr />

          <Provider
            provide={[
              { provide: MultiplyCounterConfig, useValue: { multiplyBy: 4 } },
              { provide: CounterService, useClass: MultiplyCounterService },
            ]}
          >
            <header>
              <h2>Counter component with MultiplyCounterService instance</h2>
              <h4 className="text-secondary">multiply by 4</h4>
            </header>
            <Counter />
          </Provider>
        </Provider>
      </div>
    )
  }
}
