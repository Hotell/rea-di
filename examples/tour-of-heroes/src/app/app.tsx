import { Inject, Provider } from '@martin_hotell/rea-di'
import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import { Dashboard, HeroDetail, Heroes } from './components'
import { HeroService } from './hero.service'
import { HttpClient, HttpClientConfig } from './http-client.service'
import { Messages, MessageService } from './messages'

export class App extends Component {
  title = 'Tour of Heroes'
  render() {
    return (
      <div className="app">
        <Provider
          provide={[
            MessageService,
            HeroService,
            HttpClient,
            {
              provide: HttpClientConfig,
              useValue: {
                baseURL:
                  // 'https://my-json-server.typicode.com/hotell/rea-di/examples',
                  'http://localhost:3000/',
              } as HttpClientConfig,
            },
          ]}
        >
          <Router>
            <>
              <nav>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/heroes">Heroes</NavLink>
              </nav>
              <Switch>
                <Route
                  path="/dashboard"
                  render={(props) => (
                    <Inject providers={{ heroService: HeroService }}>
                      {({ heroService }) => (
                        <Dashboard heroService={heroService} />
                      )}
                    </Inject>
                  )}
                />
                <Route
                  path="/heroes"
                  render={(props) => (
                    <Inject providers={{ heroService: HeroService }}>
                      {({ heroService }) => (
                        <Heroes heroService={heroService} />
                      )}
                    </Inject>
                  )}
                />
                <Route
                  path="/detail/:id"
                  render={(props) => (
                    <Inject providers={{ heroService: HeroService }}>
                      {({ heroService }) => (
                        <HeroDetail {...props} heroService={heroService} />
                      )}
                    </Inject>
                  )}
                />
                <Route render={() => <Redirect to="/dashboard" />} />
              </Switch>
              <Messages />
            </>
          </Router>
        </Provider>
      </div>
    )
  }
}
