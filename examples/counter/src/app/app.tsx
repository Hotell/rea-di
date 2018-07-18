import { Provider, Inject } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { CounterService } from './counter.service'
import { Counter } from './counter'

export class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Counter app</h1>
        <Provider provide={[CounterService]}>
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
