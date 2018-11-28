import { registerHttpClientProviders } from '@martin_hotell/axios-http'
import { DependencyProvider } from '@martin_hotell/rea-di'
import { Component, createElement, Fragment } from 'react'

import { Profile } from './components/profile'
import SearchUser from './components/search-user'
import { GithubUserService } from './user.service'

export class App extends Component {
  render() {
    return (
      <div className="row flex-center">
        <h1>GitHub User Search 👀</h1>
        <DependencyProvider
          providers={[
            registerHttpClientProviders({ baseURL: 'https://api.github.com' }),
            GithubUserService,
          ]}
        >
          <Fragment>
            <SearchUser />
            <Profile />
          </Fragment>
        </DependencyProvider>
      </div>
    )
  }
}
