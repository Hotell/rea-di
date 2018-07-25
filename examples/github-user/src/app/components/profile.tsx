import { Inject } from '@martin_hotell/rea-di'
import { Component, createElement } from 'react'

import { GithubUserService } from '../user.service'
import { Repos } from './repos'
import { UserProfile } from './user-profile'

export class Profile extends Component {
  render() {
    return (
      <Inject providers={{ userService: GithubUserService }}>
        {({ userService }) => {
          const { username, repos, bio } = userService.state

          if (bio && repos) {
            return (
              <div className="row">
                <div className="col sm-12 md-6">
                  <UserProfile username={username} bio={bio} />
                </div>
                <div className="col sm-12 md-6">
                  <Repos username={username} repos={repos} />
                </div>
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
