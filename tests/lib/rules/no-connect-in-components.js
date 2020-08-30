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
    "react-rxjs `bind` shouldn't be called within Components. Call it once in the root scope and use the hook in the Component",
};
ruleTester.run("no-bind-in-components", rule, {
  valid: [
    `
            import { bind } from '@react-rxjs/core';

            const [useValue] = bind(value$);

            function MyComponent() {
                const value = useValue();
            }
        `,
    `
            const bind = (observable) => connect(observable);

            function MyComponent() {
                bind(observable);
            }
        `,
  ],

  invalid: [
    {
      code: `
                import { bind } from '@react-rxjs/core';

                function myFunction() { bind() }
            `,
      errors: [error],
    },
    {
      code: `
                import { bind } from '@react-rxjs/core';

                function myFunction() { bind() }
            `,
      errors: [error],
    },
  ],
});
