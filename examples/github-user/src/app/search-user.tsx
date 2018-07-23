// tslint:disable:jsx-no-lambda
import { withInjectables } from '@martin_hotell/rea-di'
import React, { createRef, SyntheticEvent } from 'react'
import { GithubUserService } from './user.service'

type Props = {
  userService: GithubUserService
}
export class SearchUser extends React.Component<Props> {
  private usernameRef = createRef<HTMLInputElement>()
  private submitBtnRef = createRef<HTMLButtonElement>()
  handleSubmit(ev: SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault()
    const username = this.usernameRef.current
    const btn = this.submitBtnRef.current
    if (!username || !btn) {
      return
    }

    btn.disabled = true
    username.disabled = true

    this.props.userService.setActiveUser({ username: username.value })

    this.props.userService
      .getGithubInfo(username.value)
      .then(({ bio, repos }) => {
        this.props.userService.setActiveUser({ bio, repos })
        btn.disabled = false
        username.disabled = false
        username.value = ''
      })
  }
  render() {
    return (
      <div className="col-sm-12">
        <form onSubmit={(ev) => this.handleSubmit(ev)} noValidate>
          <div className="form-group col-sm-7">
            <input
              type="text"
              className="form-control"
              ref={this.usernameRef}
            />
          </div>
          <div className="form-group col-sm-5">
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
}

export default withInjectables({ userService: GithubUserService })(SearchUser)
