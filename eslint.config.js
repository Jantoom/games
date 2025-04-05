import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import {
  config,
  configs as tseslintConfigs,
  parser as tseslintParser,
} from 'typescript-eslint';

export default config(
  {
    ignores: ['dist'],
    extends: [js.configs.recommended],
  },
  {
    // files: ['src/**/*'],
    ignores: ['dist', 'node_modules', 'public'],
    extends: [
      tseslintConfigs.recommendedTypeChecked,
      importPlugin.flatConfigs.recommended, // eslint-disable-line
      importPlugin.flatConfigs.typescript, // eslint-disable-line
      unicorn.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.recommended,
      prettier,
    ],
    languageOptions: {
      parser: tseslintParser,
      ecmaVersion: 2023,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      // 'unicorn/no-useless-undefined': 'off',
      'unicorn/no-document-cookie': 'off',
      'unicorn/filename-case': [
        'error',
        { cases: { camelCase: true, pascalCase: true, kebabCase: true } },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
);
