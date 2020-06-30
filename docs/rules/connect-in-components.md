# Ensures connect functions are not being called within Components (connect-in-components)

`connectObservable` and `connectFactoryObservable` should be used to create a
shared hook from an observable. They shouldn't be used directly in React Components

## Rule Details

Examples of **incorrect** code for this rule:

```js
const Counter = () => {
  const [useCounter] = connectObservable(count$);
  const counter = useCounter();

  return <div>{counter}</div>;
};
```

Examples of **correct** code for this rule:

```js
const [useCounter] = connectObservable(count$);
const Counter = () => {
  const counter = useCounter();

  return <div>{counter}</div>;
};
```
