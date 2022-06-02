module.exports = {
  root: true,
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  ignorePatterns: [
    'lib/*',
    'SwedbankPayClient.js',
    'Types.js',
    'Errors.js',
    'Factories.js',
    'LiveEntities.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    '@typescript-eslint/lines-between-class-members': [
      'error',
      {
        exceptAfterOverload: true,
        exceptAfterSingleLine: true,
      },
    ],
    '@typescript-eslint/no-floating-promises': ['error'],
    '@typescript-eslint/no-namespace': [
      'error',
      {
        allowDeclarations: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'class-methods-use-this': ['off'],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-restricted-syntax': ['off'],
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
      },
    ],
    'no-void': ['error', { allowAsStatement: true }],
  },
  env: {
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};
