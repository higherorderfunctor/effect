module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
    tsconfigRootDir: __dirname,
    extraFileExtensions: [".vue"], // optimization only for ProjectService to prevent project refresh
    projectService: {
      incremental: true
    }
  },
  settings: {
    "import/parsers": {
      espree: [".js", ".cjs", ".mjs", ".jsx"],
      "@typescript-eslint/parser": [".ts", ".cts", ".mts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@effect/recommended"
  ],
  plugins: [
    "deprecation",
    "import",
    "sort-destructure-keys",
    "simple-import-sort",
    "codegen"
  ],
  rules: {
    "codegen/codegen": "error",
    "no-fallthrough": "off",
    "no-irregular-whitespace": "off",
    "object-shorthand": "error",
    "prefer-destructuring": "off",
    "sort-imports": "off",
    "no-restricted-syntax": ["error", {
      "selector": "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
      "message": "Do not use spread arguments in Array.push"
    }],
    "no-unused-vars": "off",
    "prefer-rest-params": "off",
    "prefer-spread": "off",
    "import/first": "error",
    "import/no-cycle": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": "off",
    "import/order": "off",
    "simple-import-sort/imports": "off",
    "sort-destructure-keys/sort-destructure-keys": "error",
    "deprecation/deprecation": "off",
    "@typescript-eslint/array-type": [
      "warn",
      { default: "generic", readonly: "generic" }
    ],
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-array-constructor": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-namespace": "off",
    "@effect/dprint": [
      "error",
      {
        config: {
          indentWidth: 2,
          lineWidth: 120,
          semiColons: "asi",
          quoteStyle: "alwaysDouble",
          trailingCommas: "never",
          operatorPosition: "maintain",
          "arrowFunction.useParentheses": "force"
        }
      }
    ]
  },
  overrides: [
    {
      files: ["*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: {
          js: "@typescript-eslint/parser",
          ts: "@typescript-eslint/parser",
          "<template>": "@typescript-eslint/parser"
        },
        warnOnUnsupportedTypeScriptVersion: false,
        tsconfigRootDir: __dirname,
        extraFileExtensions: [".vue"], // optimization only for ProjectService to prevent project refresh
        projectService: {
          incremental: true
        }
      },
      settings: {
        "import/parsers": {
          espree: [".js", ".cjs", ".mjs", ".jsx"],
          "@typescript-eslint/parser": [".ts", ".cts", ".mts", ".tsx"],
          "vue-eslint-parser": [".vue"]
        },
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true
          }
        }
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@effect/recommended",
        "plugin:vue/vue3-recommended",
        "@vue/eslint-config-typescript/recommended",
        "plugin:vuetify/recommended",
        "plugin:vuejs-accessibility/recommended",
        "@vue/eslint-config-prettier"
      ],
      rules: {
        "codegen/codegen": "off"
      }
    }
  ]
}
