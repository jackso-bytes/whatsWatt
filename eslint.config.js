import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import sonarjsConfigs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import security from 'eslint-plugin-security';
import playwright from 'eslint-plugin-playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // React rules are covered by next/core-web-vitals
  sonarjsConfigs.configs.recommended, // Code smells, cognitive complexity
  unicorn.configs['recommended'], // Modern JS best practices
  security.configs.recommended, // Security vulnerabilities
  // ...tailwindcss.configs['flat/recommended'], // Tailwind consistency doesn't have support for 4 yet
  playwright.configs['flat/recommended'], // Test patterns
  {
    // @ts-expect-error - no types for this plugin
    plugins: {
      'better-max-params': (await import('eslint-plugin-better-max-params'))
        .default,
    },
    rules: {
      'better-max-params/better-max-params': [
        'error',
        {
          constructor: 10, // NestJS DI needs more
          func: 2,
        },
      ],
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
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'app/generated/**',
      'components/ui/**',
      'coverage/**',
    ],
  },
];

export default eslintConfig;
