import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import security from 'eslint-plugin-security'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'build', 'coverage'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      sonarjs.configs.recommended,
      security.configs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-array-reduce': 'off',
    },
  },
)
