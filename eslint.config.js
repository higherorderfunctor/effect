/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as effectPlugin from "@effect/eslint-plugin"
import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import eslint from "@eslint/js"
import globals from "globals"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TSESLint } from "@typescript-eslint/utils"
import codegenPlugin from "eslint-plugin-codegen"
import deprecationPlugin from "eslint-plugin-deprecation"
import importPlugin from "eslint-plugin-import"
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort"
import sortDestructureKeysPlugin from "eslint-plugin-sort-destructure-keys"
import vuePlugin from "eslint-plugin-vue"
import vueA11yPlugin from "eslint-plugin-vuejs-accessibility"
import * as tseslint from "typescript-eslint"
import vueParser from "vue-eslint-parser"

const compat = new FlatCompat({
  baseDirectory: import.meta.url
})

/** @type {(configs: TSESLint.FlatConfig.Config) => TSESLint.FlatConfig.Config} */
const hotfixes = (config) => ({
  ...config,
  rules: Object.fromEntries(
    Object.entries(config.rules ?? {}).map(([key, value]) => {
      return [key, value]
      // no hotfixes today
    })
  )
})

/** @type {(overrides: Partial<TSESLint.FlatConfig.Config>, configs: TSESLint.FlatConfig.ConfigArray) => TSESLint.FlatConfig.ConfigArray} */
const overrideWith = (overrides, configs) =>
  configs.map((config) =>
    hotfixes({ ...config, ...overrides, plugins: { ...overrides.plugins, ...(config.plugins ?? {}) } })
  )

/** ****************************************************************************
 * TypeScript & JavaScript
 ***************************************************************************** */

/** @type {TSESLint.FlatConfig.Config & {languageOptions: TSESLint.FlatConfig.LanguageOptions, settings: TSESLint.FlatConfig.Settings}} */
const tsOverrides = {
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      warnOnUnsupportedTypeScriptVersion: false,
      tsconfigRootDir: import.meta.dirname,
      extraFileExtensions: [".vue"], // optimization only for ProjectService to prevent project refresh
      projectService: {
        incremental: true
      }
    },
    globals: {
      ...globals.browser
    }
  },
  plugins: {
    "@typescript-eslint": tseslint.plugin,
    "import": fixupPluginRules(importPlugin),
    "simple-import-sort": simpleImportSortPlugin,
    "sort-destructure-keys": sortDestructureKeysPlugin,
    codegen: codegenPlugin,
    deprecation: deprecationPlugin,
    "@effect": effectPlugin
  },
  settings: {
    "import/parsers": {
      espree: [".js", ".cjs", ".mjs", ".jsx"],
      "@typescript-eslint/parser": [".ts", ".cts", ".mts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
}

const tsRules = overrideWith(tsOverrides, [
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.strictTypeChecked,
  { rules: effectPlugin.configs.recommended.rules },
  {
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
    }
  }
])

/** ****************************************************************************
 * Vue
 ***************************************************************************** */

/** @type {TSESLint.FlatConfig.Config } */
const vueOverrides = {
  files: ["packages/*/{src,lib,tests}/**/*.vue"],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      ...tsOverrides.languageOptions.parserOptions,
      parser: {
        js: tseslint.parser,
        ts: tseslint.parser,
        "<template>": tseslint.parser
      },
      extraFileExtensions: [".vue"] // let's project service treat vue files as ts
    },
  },
  plugins: {
    ...tsOverrides.plugins
  },
  settings: tsOverrides.settings
}

const vueRecommended = /** @type {TSESLint.FlatConfig.ConfigArray} */ (vuePlugin.configs["flat/recommended"])

const vueRules = overrideWith(vueOverrides, [
  ...tsRules,
  ...vueRecommended,
  ...compat.extends("@vue/eslint-config-typescript/recommended"),
  ...compat.extends("plugin:vuetify/recommended"),
  ...vueA11yPlugin.configs["flat/recommended"],
  ...compat.extends("@vue/eslint-config-prettier"),
  { rules: { "codegen/codegen": "off" } } // doesn't work with vue
])

/** ****************************************************************************
 * Final Configuration
 ***************************************************************************** */

const eslintConfig = [
  {
    ignores: ["dist", "build", "docs", "*.md"],
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  // by filetype configs
  ...tsRules,
  ...vueRules
]

export default eslintConfig
