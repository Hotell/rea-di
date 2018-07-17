import React, { Component } from 'react'
import {
  Link,
  NavLink,
  Route,
  BrowserRouter as Router,
  Redirect,
  Switch,
} from 'react-router-dom'
import { Provider, Inject } from '@martin_hotell/rea-di'

import { Messages, MessageService } from './messages'
import { HeroService } from './hero.service'
import { Dashboard, Heroes, HeroDetail } from './components'

export class App extends Component {
  title = 'Tour of Heroes'
  render() {
    return (
      <div className="app">
        <Provider provide={[MessageService, HeroService]}>
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
