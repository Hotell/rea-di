// tslint:disable:jsx-no-lambda
import { withInjectables } from '@martin_hotell/rea-di'
import { Component, createElement, createRef } from 'react'

import { GithubUserService } from '../user.service'

type Props = {
  userService: GithubUserService
}
export class SearchUser extends Component<Props> {
  private usernameRef = createRef<HTMLInputElement>()
  private submitBtnRef = createRef<HTMLButtonElement>()

  render() {
    return (
      <div className="col sm-12">
        <form onSubmit={(ev) => this.handleSubmit(ev)} noValidate>
          <div className="form-group">
            <input
              type="text"
              placeholder="github username..."
              className="input-block"
              ref={this.usernameRef}
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block btn-primary"
              ref={this.submitBtnRef}
            >
              Search Github
            </button>
          </div>
        </form>
      </div>
    )
  }
  private handleSubmit(ev: import('react').FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const username = this.usernameRef.current!
    const btn = this.submitBtnRef.current!

    btn.disabled = true
    username.disabled = true

    // first we set just username
    this.props.userService.setActiveUser({ username: username.value })

    // with that we can initiate HTTP Get
    this.props.userService
      .getGithubInfo(username.value)
      .then(({ bio, repos }) => {
        this.props.userService.setActiveUser({ bio, repos })

        btn.disabled = false
        username.disabled = false
        username.value = ''
      })
  }
}

export default withInjectables({ userService: GithubUserService })(SearchUser)
