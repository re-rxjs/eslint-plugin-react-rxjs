"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var { rules } = require("../../../dist/bundle"),
  RuleTester = require("eslint").RuleTester;

var rule = rules['no-bind-in-components'];

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
});
const error = {
  message:
    "react-rxjs connect functions shouldn't be called within Components. Call them once in the root scope and use the hook in the Component",
};
ruleTester.run("no-bind-in-components", rule, {
  valid: [
    `
            import { connectObservable } from 'react-rxjs';

            const [useValue] = connectObservable(value$);

            function MyComponent() {
                const value = useValue();
            }
        `,
    `
            const connectObservable = (observable) => connect(observable);

            function MyComponent() {
                connectObservable(observable);
            }
        `,
  ],

  invalid: [
    {
      code: `
                import { connectObservable } from 'react-rxjs';

                function myFunction() { connectObservable() }
            `,
      errors: [error],
    },
    {
      code: `
                import { connectObservable } from 'react-rxjs';

                function myFunction() { connectObservable() }
            `,
      errors: [error],
    },
  ],
});
