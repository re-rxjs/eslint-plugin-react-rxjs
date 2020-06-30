/**
 * @fileoverview Ensures connect is only called in the root scope
 * @author Victor Oliva
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const targetNames = [
    'connectObservable',
    'connectFactoryObservable'
];
const packageName = 'react-rxjs';

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensures connect is only called in the root scope",
            category: "Possible Errors",
            recommended: true
        },
        fixable: null,
        schema: []
    },

    create: function (context) {
        const importedTargetNames = [];
        const importedNamespaceNames = [];
        let functionScope = 0;

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const startFunctionScope = () => functionScope++;
        const endFunctionScope = () => functionScope--;

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportSpecifier(node) {
                if (node.parent.source.value === packageName) {
                    if (targetNames.includes(node.imported.name)) {
                        importedTargetNames.push(node.local.name);
                    }
                }
            },
            ImportNamespaceIdentifier(node) {
                if (node.parent.source.value === packageName) {
                    importedNamespaceNames.push(node.local.name);
                }
            },
            CallExpression(node) {
                if (functionScope === 0) {
                    return;
                }

                const { callee } = node;
                if (callee.type === "MemberExpression") {
                    if (importedNamespaceNames.includes(callee.object.name) && targetNames.includes(callee.property.name)) {
                        context.report({
                            message: 'ur calling connect inside a function. Plz dont do that.',
                            node
                        })
                    }
                }
                if (callee.type === "Identifier") {
                    if (importedTargetNames.includes(callee.name)) {
                        context.report({
                            message: 'ur calling connect inside a function. Plz dont do that.',
                            node
                        })
                    }
                }
            },
            FunctionExpression: startFunctionScope,
            "FunctionExpression:exit": endFunctionScope,
            FunctionDeclaration: startFunctionScope,
            "FunctionDeclaration:exit": endFunctionScope,
            ArrowFunctionExpression: startFunctionScope,
            "ArrowFunctionExpression:exit": endFunctionScope,
        };
    }
};
