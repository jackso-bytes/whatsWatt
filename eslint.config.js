import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import security from 'eslint-plugin-security'
import playwright from 'eslint-plugin-playwright'
import globals from 'globals'
import betterMaxParams from 'eslint-plugin-better-max-params'

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'jest.config.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  security.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'better-max-params': betterMaxParams,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
      'better-max-params/better-max-params': ['error', { func: 2, constructor: 10 }],
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true }],
      'max-lines': ['error', { max: 250, skipBlankLines: true }],
      'no-magic-numbers': [
        'error',
        {
          detectObjects: false,
          enforceConst: true,
          ignore: [0, 1, -1, 2],
          ignoreArrayIndexes: true,
        },
      ],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/e2e/**', '**/*.e2e.{ts,tsx}'],
    ...playwright.configs['flat/recommended'],
  },
)
