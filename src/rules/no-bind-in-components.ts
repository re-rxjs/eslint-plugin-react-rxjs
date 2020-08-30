"use strict";
import type { Rule } from "eslint";
import type * as estree from "estree";

declare module "estree" {
  interface BaseNodeWithoutComments {
    parent: Node;
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const targetName = "bind";
const packageName = "@react-rxjs/core";

const errorMessage = `react-rxjs \`bind\` shouldn't be called within Components. Call it once in the root scope and use the hook in the Component`;

export const meta: Rule.RuleMetaData = {
  type: "problem",
  docs: {
    description: "Ensures bind is not called in React Components",
    category: "Possible Errors",
    recommended: true,
  },
  schema: [],
};

export function create(context: Rule.RuleContext): Rule.RuleListener {
  const importedTargetNames: string[] = [];
  const importedNamespaceNames: string[] = [];
  let functionScope = 0;

  const startFunctionScope = () => functionScope++;
  const endFunctionScope = () => functionScope--;

  return {
    ImportSpecifier(n) {
      const node = assertType<estree.ImportSpecifier>(n, "ImportSpecifier")!;
      if (
        (node.parent as estree.ImportDeclaration).source.value === packageName
      ) {
        if (targetName === node.imported.name) {
          importedTargetNames.push(node.local.name);
        }
      }
    },
    ImportNamespaceIdentifier(n: estree.Node) {
      const node = assertType<estree.ImportNamespaceSpecifier>(
        n,
        "ImportNamespaceSpecifier"
      )!;
      if (
        (node.parent as estree.ImportDeclaration).source.value === packageName
      ) {
        importedNamespaceNames.push(node.local.name);
      }
    },
    CallExpression(n) {
      const node = assertType<estree.CallExpression>(n, "CallExpression")!;
      if (functionScope === 0) {
        return;
      }

      const { callee } = node;
      const memberExpression = assertType<estree.MemberExpression>(
        callee,
        "MemberExpression"
      );
      if (memberExpression) {
        const objectIdentifier = assertType<estree.Identifier>(
          memberExpression.object,
          "Identifier"
        );
        const propertyIdentifier = assertType<estree.Identifier>(
          memberExpression.property,
          "Identifier"
        );

        if (
          objectIdentifier &&
          propertyIdentifier &&
          importedNamespaceNames.includes(objectIdentifier.name) &&
          targetName === propertyIdentifier.name
        ) {
          context.report({
            message: errorMessage,
            node,
          });
        }
      }

      const identifier = assertType<estree.Identifier>(callee, "Identifier");
      if (identifier) {
        if (importedTargetNames.includes(identifier.name)) {
          context.report({
            message: errorMessage,
            node,
          });
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

function assertType<T extends estree.Node>(
  value: estree.Node,
  type: T["type"]
): T | null {
  if (value && value.type === type) {
    return value as T;
  }
  return null;
}
