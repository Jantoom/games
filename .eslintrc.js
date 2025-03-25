module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2023: true,
  },
  parser: '@typescript-eslint/parser', // Use TypeScript parser
  parserOptions: {
    project: './tsconfig.json', // Required for TypeScript rules that need type info
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript best practices
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Strict type-checking rules
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:jsdoc/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'unicorn', 'jsdoc'],
  rules: {
    // *** TypeScript-Specific Rules ***
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',

    // *** Prettier Formatting ***
    'prettier/prettier': 'error',

    // *** Import Order ***
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
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // *** Naming Conventions (Unicorn) ***
    'unicorn/filename-case': ['error', { case: 'camelCase' }],
    'unicorn/prevent-abbreviations': 'error',

    // *** Best Practices (Unicorn) ***
    'unicorn/no-null': 'error',
    'unicorn/no-array-reduce': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/prefer-node-protocol': 'error',

    // *** JSDoc Rules ***
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
  },
};
