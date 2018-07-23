import { Provider } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { Counter } from './counter'
import { CounterService } from './counter.service'

export class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Counter app</h1>
        <Provider provide={[CounterService]}>
          <Counter />
        </Provider>
      </div>
    )
  }
}
