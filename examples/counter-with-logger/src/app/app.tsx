import { Inject, Provider } from '@martin_hotell/rea-di'
import { Component, createElement } from 'react'

import { Counter } from './counter'
import { CounterService } from './counter.service'
import { Logger } from './logger.service'

export class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Counter app</h1>
        <Provider provide={[CounterService, Logger]}>
          <Inject providers={{ counterService: CounterService }}>
            {(injectables) => (
              <Counter counterService={injectables.counterService} />
            )}
          </Inject>
        </Provider>
      </div>
    )
  }
}
