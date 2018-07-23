import { registerHttpClientProviders } from '@martin_hotell/axios-http'
import { Provider } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { Profile } from './profile'
import SearchUser from './search-user'
import { GithubUserService } from './user.service'

export class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Counter app</h1>
        <Provider
          provide={[
            registerHttpClientProviders({ baseURL: 'https://api.github.com' }),
            GithubUserService,
          ]}
        >
          <section>
            <SearchUser />
            <Profile />
          </section>
        </Provider>
      </div>
    )
  }
}
