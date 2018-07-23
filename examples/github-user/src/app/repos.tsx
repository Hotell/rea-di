import React, { Component } from 'react'
import { GithubUserRepo } from './repo.model'

type Props = { repos: GithubUserRepo[]; username: string }
export class Repos extends Component<Props> {
  render() {
    const { repos, username } = this.props

    return (
      <div>
        <h3>{username} Repos</h3>
        <ul className="list-group">
          {repos.map((repo) => {
            return (
              <li className="list-group-item" key={repo.name}>
                {repo.html_url && (
                  <h4>
                    <a href={repo.html_url}>{repo.name}</a>
                  </h4>
                )}
                {repo.description && <p>{repo.description}</p>}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
