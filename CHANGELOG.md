# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>

# [1.0.0](https://github.com/Hotell/rea-di/compare/v0.2.0...v1.0.0) (2018-12-06)

### Features

- **api:** use tuples for injection on both Provider and Inject ([#9](https://github.com/Hotell/rea-di/issues/9)) ([6364f80](https://github.com/Hotell/rea-di/commit/6364f80))
- **inject:** implement optional ([#10](https://github.com/Hotell/rea-di/issues/10)) ([7060c65](https://github.com/Hotell/rea-di/commit/7060c65)), closes [#8](https://github.com/Hotell/rea-di/issues/8)

### BREAKING CHANGES

- **api:** - Previously providers registration used dictionary as well as Inject. Now both
  components (DependencyProvider, Inject) use arrays to both register providers as well as inject instances via token.

* New minimal required TS version is 3.1
* renamed:
  - Provide -> DependencyProvider
  - withProvider -> withDependencyProvider
* Provider used previously `provider` prop -> `providers`
* Inject used previously `providers` prop -> `values`
* withDependencyProviders accepts n-ary arguments

<a name="0.2.0"></a>

# [0.2.0](https://www.github.com/Hotell/rea-di/compare/v0.1.0...v0.2.0) (2018-07-27)

### Bug Fixes

- **build:** don't bundle peer deps wihin bundle ([790885e](https://www.github.com/Hotell/rea-di/commit/790885e))

### Features

- **hoc:** properly expose WrappedComponent type (#7) ([883074c](https://www.github.com/Hotell/rea-di/commit/883074c))

<a name="0.1.0"></a>

# [0.1.0](https://www.github.com/Hotell/rea-di/compare/v0.0.1...v0.1.0) (2018-07-23)

### Features

- **hoc:** implement HoC alternatives for Provide and Inject ([54115b6](https://www.github.com/Hotell/rea-di/commit/54115b6))

<a name="0.0.1"></a>

## 0.0.1 (2018-07-16)

### Features

- add initial implementation with react wrappers ([1c784fc](https://www.github.com/Hotell/read-di/commit/1c784fc))
