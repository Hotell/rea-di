import { Inject } from '@martin_hotell/rea-di'
import React, { Component } from 'react'

import { Repos } from './repos'
import { UserProfile } from './user-profile'
import { GithubUserService } from './user.service'

export class Profile extends Component {
  render() {
    return (
      <Inject providers={{ userService: GithubUserService }}>
        {({ userService }) => {
          const { username, repos, bio } = userService.state

          if (bio && repos) {
            return (
              <div className="row">
                <div className="col-md-4">
                  <UserProfile username={username} bio={bio} />
                </div>
                <div className="col-md-4">
                  <Repos username={username} repos={repos} />
                </div>
                <div className="col-md-4" />
              </div>
            )
          }

          if (username) {
            return `Loading... ${username}`
          }
        }}
      </Inject>
    )
  }
}
