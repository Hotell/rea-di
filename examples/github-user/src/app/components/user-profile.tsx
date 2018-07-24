import React, { Component } from 'react'
import { GithubUser } from '../user.model'

type Props = { username: string; bio: GithubUser }
export class UserProfile extends Component<Props> {
  render() {
    const { bio } = this.props

    return (
      <div>
        {bio.avatar_url && (
          <img src={bio.avatar_url} className="img-rounded img-responsive" />
        )}

        <ul>
          {bio.name && <li>Name: {bio.name}</li>}
          {bio.login && <li>Username: {bio.login}</li>}
          {bio.email && <li>Email: {bio.email}</li>}
          {bio.location && <li>Location: {bio.location}</li>}
          {bio.company && <li>Company: {bio.company}</li>}
          {bio.followers && <li>Followers: {bio.followers}</li>}
          {bio.following && <li>Following: {bio.following}</li>}
          {bio.public_repos && <li>Public Repos: {bio.public_repos}</li>}
          {bio.blog && (
            <li>
              Blog: <a href={bio.blog}> {bio.blog}</a>
            </li>
          )}
        </ul>
      </div>
    )
  }
}
