import { registerHttpClientProviders } from '@martin_hotell/axios-http'
import { Provider } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { Profile } from './components/profile'
import SearchUser from './components/search-user'
import { GithubUserService } from './user.service'

export class App extends Component {
  render() {
    return (
      <div className="row flex-center">
        <h1>GitHub User Search 👀</h1>
        <Provider
          provide={[
            registerHttpClientProviders({ baseURL: 'https://api.github.com' }),
            GithubUserService,
          ]}
        >
          <SearchUser />
          <Profile />
        </Provider>
      </div>
    )
  }
}
