# Examples

`Read-di` is distributed with a few examples in its source code. Most of these examples are also on `CodeSandbox`.

All examples use `parcel-js` as this is the easiest way how to boot any demo app ;).

## Counter

Run the [Counter](./counter) example:

```
git clone https://github.com/hotell/rea-di.git

cd rea-di/examples/counter
yarn install
yarn start
```

Or check out the [sandbox](https://codesanbox.io/).

This is the most basic example of using Rea-di for handling state on Service layer with React.

This example includes tests.

## Counter With Logger

Run the [Counter with Logger app](.) example:

```
git clone https://github.com/hotell/rea-di.git

cd rea-di/examples/counter-with-logger
yarn install
yarn start
```

Or check out the [sandbox](https://codesanbox.io/).

This builds on previous counter example and adds `Logger` service which is injected to `CounterService`. With that we get logs into console on every action.

## Counter With multiple Injectors and hierarchies

Run the [Counter with Multiple Injectors and hierarchies app](.) example:

```
git clone https://github.com/hotell/rea-di.git

cd rea-di/examples/counter-with-multiple-injectors
yarn install
yarn start
```

Or check out the [sandbox](https://codesanbox.io/).

This builds on previous **counter with logger** example and demonstrates multiple child injectors resolution and aliasing by using one common `Counter` component with different service instances injected by the same token resolved via tree hierarchy. Also it adds configurable `MultiplyCounterService`.

Try to do this without DI framework... Good luck with that 😇

## Tour of Heroes

Run the [Tour of Heroes](./tour-of-heroes) example:

```
git clone https://github.com/hotell/rea-di.git

cd rea-di/examples/tour-of-heroes
yarn install
yarn start
```

Or check out the [sandbox](https://codesanbox.io/).

This is the best example to get a complete understanding of how to register and work with real life DI container powered by `Rea-DI` within React application. In a nutshel this app is "just" an [Angular Tour of Heroes Tutorial](https://angular.io/tutorial) rewrite to React with `Rea-DI`.

This example includes tests.

## Tour of Heroes ( with Redux and Redux-Observable )

> @TODO

Run the [Tour of Heroes](./tour-of-heroes) example:

```
git clone https://github.com/hotell/rea-di.git

cd rea-di/examples/tour-of-heroes-redux-redux-observable
yarn install
yarn start
```

Or check out the [sandbox](https://codesanbox.io/).
