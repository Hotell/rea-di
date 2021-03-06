import { DependencyProvider } from '@martin_hotell/rea-di'
import { Component, createElement } from 'react'

import { Counter } from './counter'
import { CounterService } from './counter.service'

export class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Counter app</h1>
        <DependencyProvider providers={[CounterService]}>
          <Counter />
        </DependencyProvider>
      </div>
    )
  }
}
