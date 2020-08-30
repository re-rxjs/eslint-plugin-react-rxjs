"use strict";
import rules from "./rules";

export { rules };

export const configs = {
  recommended: {
    plugins: ["react-rxjs"],
    rules: {
      "react-rxjs/no-bind-in-components": "error",
    },
  },
};
