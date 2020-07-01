"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-connect-in-components"),
  RuleTester = require("eslint").RuleTester;

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
ruleTester.run("no-connect-in-components", rule, {
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