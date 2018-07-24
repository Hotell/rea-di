import React, { Component } from 'react'
import { GithubUserRepo } from '../repo.model'

type Props = { repos: GithubUserRepo[]; username: string }
export class Repos extends Component<Props> {
  render() {
    const { repos, username } = this.props

    return (
      <div>
        <h3 className="text-secondary">@{username} Repos</h3>
        <section className="row">
          {repos.map((repo) => (
            <div key={repo.name} className="col sm-12 margin-bottom-large card">
              <div className="card-body">
                {repo.html_url && (
                  <h4 className="card-title">
                    <a href={repo.html_url}>{repo.name}</a>
                  </h4>
                )}
                {repo.description && (
                  <p className="card-text">{repo.description}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    )
  }
}
