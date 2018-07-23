import { HttpClient } from '@martin_hotell/axios-http'
import { Injectable } from 'injection-js'

import { WithState } from '@martin_hotell/rea-di'
import { GithubUserRepo } from './repo.model'
import { GithubUser } from './user.model'

const endpointPath = 'users'

type State = Readonly<typeof initialState>
const initialState = {
  username: '',
  bio: null as GithubUser | null,
  repos: null as GithubUserRepo[] | null,
}

@Injectable()
export class GithubUserService extends WithState<State> {
  readonly state: State = initialState
  constructor(private http: HttpClient) {
    super()
  }
  setActiveUser(user: Partial<State>) {
    this.setState((prevState) => ({ ...prevState, ...user }))
  }
  getRepos(username: string) {
    return this.http.get<GithubUserRepo[]>(`${endpointPath}/${username}/repos`)
  }

  getUserInfo(username: string) {
    return this.http.get<GithubUser>(`${endpointPath}/${username}`)
  }

  getGithubInfo(username: string) {
    return Promise.all([
      this.getRepos(username),
      this.getUserInfo(username),
    ]).then(([repos, bio]) => ({ repos: repos.data, bio: bio.data }))
  }
}
