# rea-di ( pronounced Ready 🤙)

> Dependency injection for React done right. Hierarchical injection on both component and service layer powered by [injection-js](https://github.com/mgechev/injection-js) (Angular DI framework) 🖖

[![Greenkeeper badge](https://badges.greenkeeper.io/Hotell/rea-di.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/Hotell/rea-di.svg?branch=master)](https://travis-ci.org/Hotell/rea-di)
[![NPM version](https://img.shields.io/npm/v/standard-version.svg)](https://www.npmjs.com/package/rea-di)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

1.  use it 💪

### Webpack

> #### NOTE:
>
> Don't forget to turn off ES modules tranpspilation to enable tree-shaking!
>
> - babel: `{"modules": false}`
> - typescript: `{"module": "esnext"}`

```ts
// main.ts or main.js
import { Greeter } from 'my-new-library'

const mountPoint = document.getElementById('app')
const App = () => {
  const greeter = new Greeter('Stranger')
  return `<h1>${greeter.greet()}</h1>`
}
const render = (Root: Function, where: HTMLElement) => {
  where.innerHTML = Root()
}

render(App, mountPoint)
```

```html
<!-- index.htm -->
<html>
  <head>
    <script src="bundle.js" async></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### UMD/ES2015 module aware browsers ( no bundler )

```html
<html>
  <head>
    <script type="module">
      import {Greeter} from './node_modules/my-lib/esm2015/index.js'

      const App = () => {
        const greeter = new Greeter('Stranger');
        return `<h1>${greeter.greet()}</h1>`
      }
      const render = (Root, where) => {
        where.innerHTML = Root();
      }

      render(App, mountPoint);
    </script>
    <script nomodule src="node_modules/my-lib/bundles/my-new-library.umd.min.js"></script>
    <script nomodule async>
        var Greeter = MyLib.Greeter;

        var App = function() {
          var greeter = new Greeter('Stranger');
          return '<h1>'+greeter.greet()+'</h1>'
        }
        var render = function(Root, where) {
          where.innerHTML = Root();
        }

        render(App, mountPoint);
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

## Publishing

> #### NOTE:
>
> you have to create npm account and register token on your machine
> 👉 `npm adduser`
>
> If you are using scope ( you definitely should 👌) don't forget to [`--scope`](https://docs.npmjs.com/cli/adduser#scope)

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

## Check what files are gonna be published to npm

- `yarn pack` OR `yarn release:preflight` which will create a tarball with everything that would get published to NPM

## Check size of your published NPM bundle

`yarn size`

## Format and fix lint errors

`yarn ts:style:fix`

## Generate documentation

`yarn docs`

## Commit ( via commitizen )

- this is preferred way how to create convetional-changelog valid commits
- if you preffer your custom tool we provide a commit hook linter which will error out, it you provide invalid commit message
- if you are in rush and just wanna skip commit message valiation just prefix your message with `WIP: something done` ( if you do this please squash your work when you're done with proper commit message so standard-version can create Changelog and bump version of your library appropriately )

`yarn commit` - will invoke [commitizen CLI](https://github.com/commitizen/cz-cli)

### Troubleshooting
