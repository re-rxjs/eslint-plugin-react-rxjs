/**
 * @fileoverview Ensures connect is only called in the root scope
 * @author Victor Oliva
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/react-rxjs-connect-root-scope"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    }
});
const error = {
    message: "ur calling connect inside a function. Plz dont do that."
}
ruleTester.run("react-rxjs-connect-root-scope", rule, {
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
            errors: [error]
        },
        {
            code: `
                import { connectObservable } from 'react-rxjs';

                function myFunction() { connectObservable() }
            `,
            errors: [error]
        }
    ]
});
