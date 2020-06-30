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

var ruleTester = new RuleTester();
ruleTester.run("react-rxjs-connect-root-scope", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "<failing code>",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
