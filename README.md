# rea-di ( pronounced Ready 🤙)

> Dependency injection for React done right. Hierarchical injection on both component and service layer powered by [injection-js](https://github.com/mgechev/injection-js) (Angular DI framework) 🖖

[![Greenkeeper badge](https://badges.greenkeeper.io/Hotell/rea-di.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/Hotell/rea-di.svg?branch=master)](https://travis-ci.org/Hotell/rea-di)
[![NPM version](https://img.shields.io/npm/v/standard-version.svg)](https://www.npmjs.com/package/rea-di)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Installing

```sh
yarn add rea-di

# install peer dependencies
yarn add react injection-js tslib

# install Reflect API polyfill
yarn add core-js
```

> **Note:**
>
> You need a polyfill for the [Reflect API](http://www.ecma-international.org/ecma-262/6.0/#sec-reflection).
> You can use:
>
> - [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
> - [`core-js` (`core-js/es7/reflect`)](https://www.npmjs.com/package/core-js)
>
> Also for TypeScript you will need to enable `experimentalDecorators` and `emitDecoratorMetadata` flags within your `tsconfig.json`

## Getting started

Create some services that need other services via DI framework ( Service === ES2015 Class )

```ts
// app/services.ts

import 'core-js/es7/reflect';
import { Injectable } from 'injection-js';

@Injectable()
export class Logger {
  log(...args:any[]){...}
}

@Injectable()
export class HttpClient {}

@Injectable()
export class UserService {
  // constructor Injection
  constructor(private httpClient: HttpClient, private logger: Logger) {}

  getUsers(): Promise<User[]> {
    this.logger.log('get users fetch started')

    return this.httpClient.get('api/users')
  }
}

// User Model
export class User {
  constructor(public id:string, public email: string, public age: number){}
}
```

Now you'll need to register those services within your component tree via `Provider` component that will create new `ChildInjector`.

> Our DI is hierarchical and only source of truth of this hierarchy is our React Component tree !

So our app Component/DI tree will look like following:

```
[RootInjector]
    |
    V
[ChildInjector(<App Component/>)]
  - registered providers:
  - Logger
  - HttpClient
  - UserService
    |
    V
<UserModuleComponent />
    |
    V
<Inject(UserService) from [ChildInjector] />
// UserService instance will be retrieved from closest Injector, in our case 👉 ChildInjector(App Component)
    |
    V
<Users props={userService instance from DI framework}>
    |
    V
<UserList props={users}>
```

And here is implementation:

```tsx
// main.ts

import { creaeElement } from 'react'
import { render } from 'react-dom'

import { App } from './app/app'

boot()

function boot() {
  const mountPoint = document.getElementById('app')
  render(creaeElement(App), mountPoint)
}
```

```tsx
// app/app.tsx
import React, { Component } from 'react'
import { Provider } from 'rea-di'

import { Logger, HttpClient, UserService } from './services'
import { UserModule } from './user.module'

class App extends Component {
  render() {
    return (
      // We are registering or rootInjector with following services available for whole tree
      <Provider provide={[Logger, HttpClient, UserService]}>
        <UserModule />
      </Provider>
    )
  }
}
```

With our injector created, we can now inject our services instances anywhere within the tree.

> Also this is the biggest difference and improvement in comparison with Angular. In Angular every provider is registered as global singleton ( if you don't lazy load a module or register it within @Component), With react new ChildInjector will be created anytime you use <Provide>, so you don't have to be afraid of Services leaking to the root 👌

```tsx
// app/user.module.tsx
import React, { Component } from 'react'
import { Inject } from 'rea-di'

import { UserService } from './services'
import { Users } from './users'

class UserModule extends Component {
  render() {
    return (
      // { userService: UserService } is our provider map shape which we wanna get within children function
      <Inject provide={{ userService: UserService }}>
        {/* old good React props Injection, no artificial syntax, just plain old React 👌 */}
        {({ userService }) => <Users service={userService} />}
      </Inject>
    )
  }
}
```

```tsx
// app/users.tsx
import React, { Component } from 'react'

import { UserService } from './services'
import { UserList } from './user-list'

type Props = {
  service: UserService
}
type State = Readonly<typeof initialState>

const initialState = {
  users: null as User[],
}

class Users extends Component<Props, State> {
  render() {
    const { users } = this.state
    return <div>{users ? 'Loading users...' : <UserList users={users} />}</div>
  }
  componentDidMount() {
    // here we got our UserService instance from the closest injector ( in our case we registered only one), with appropriately resolved Logger and HttpClient services
    this.props.service.getUsers().then((result) => {
      this.setState({ users: result })
    })
  }
}
```

## Publishing

Execute `yarn release` which will handle following tasks:

- bump package version and git tag
- update/(create if it doesn't exist) CHANGELOG.md
- push to github master branch + push tags
- publish build packages to npm

> releases are handled by awesome [standard-version](https://github.com/conventional-changelog/standard-version)

### Initial Release (without bumping package.json version):

`yarn release --first-release`

### Pre-release

- To get from `1.1.2` to `1.1.2-0`:

`yarn release --prerelease`

- **Alpha**: To get from `1.1.2` to `1.1.2-alpha.0`:

`yarn release --prerelease alpha`

- **Beta**: To get from `1.1.2` to `1.1.2-beta.0`:

`yarn release --prerelease beta`

### Dry run mode

See what commands would be run, without committing to git or updating files

`yarn release --dry-run`

### Check what files are gonna be published to npm

- `yarn pack` OR `yarn release:preflight` which will create a tarball with everything that would get published to NPM

## Tests

Test are written and run via Jest 💪

```
yarn test
# OR
yarn test:watch
```

## Style guide

To follow style guide, we got Robots for that (prettier and tslint), so they'll let you know if you screwed something but most of the time they will autofix things for you 🤖

### Style guide npm scripts

```sh
#Format and fix lint errors
yarn ts:style:fix
```

## Generate documentation

`yarn docs`

## Commit ( via commitizen )

- this is preferred way how to create convetional-changelog valid commits
- if you preffer your custom tool we provide a commit hook linter which will error out, it you provide invalid commit message
- if you are in rush and just wanna skip commit message valiation just prefix your message with `WIP: something done` ( if you do this please squash your work when you're done with proper commit message so standard-version can create Changelog and bump version of your library appropriately )

`yarn commit` - will invoke [commitizen CLI](https://github.com/commitizen/cz-cli)

### Troubleshooting

## Licensing

[MIT](./LICENSE.md) as always
