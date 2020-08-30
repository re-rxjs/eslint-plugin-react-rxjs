'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
var targetNames = ["connectObservable", "connectFactoryObservable"];
var packageName = "react-rxjs";
var errorMessage = "react-rxjs connect functions shouldn't be called within Components. Call them once in the root scope and use the hook in the Component";
var meta = {
    type: "problem",
    docs: {
        description: "Ensures connect is not called in React Components",
        category: "Possible Errors",
        recommended: true
    },
    schema: []
};
function create(context) {
    var importedTargetNames = [];
    var importedNamespaceNames = [];
    var functionScope = 0;
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    var startFunctionScope = function () { return functionScope++; };
    var endFunctionScope = function () { return functionScope--; };
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
        ImportSpecifier: function (node) {
            if (node.parent.source.value === packageName) {
                if (targetNames.includes(node.imported.name)) {
                    importedTargetNames.push(node.local.name);
                }
            }
        },
        ImportNamespaceIdentifier: function (node) {
            if (node.parent.source.value === packageName) {
                importedNamespaceNames.push(node.local.name);
            }
        },
        CallExpression: function (node) {
            if (functionScope === 0) {
                return;
            }
            var callee = node.callee;
            if (callee.type === "MemberExpression") {
                if (importedNamespaceNames.includes(callee.object.name) &&
                    targetNames.includes(callee.property.name)) {
                    context.report({
                        message: errorMessage,
                        node: node
                    });
                }
            }
            if (callee.type === "Identifier") {
                if (importedTargetNames.includes(callee.name)) {
                    context.report({
                        message: errorMessage,
                        node: node
                    });
                }
            }
        },
        FunctionExpression: startFunctionScope,
        "FunctionExpression:exit": endFunctionScope,
        FunctionDeclaration: startFunctionScope,
        "FunctionDeclaration:exit": endFunctionScope,
        ArrowFunctionExpression: startFunctionScope,
        "ArrowFunctionExpression:exit": endFunctionScope
    };
}

var noBindInComponents = /*#__PURE__*/Object.freeze({
    __proto__: null,
    meta: meta,
    create: create
});

var index = {
    "no-bind-in-components": noBindInComponents
};

var configs = {
    recommended: {
        plugins: ["react-rxjs"],
        rules: {
            "react-rxjs/no-bind-in-components": "error"
        }
    }
};

exports.configs = configs;
exports.rules = index;
