module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'jest',
  ],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'lines-between-class-members': 0,
    'no-trailing-spaces': [
      'error',
      {
        ignoreComments: true
      }
    ],
    'class-methods-use-this': [
      1,
    ],
    '@typescript-eslint/no-var-requires': 'warn', // please use import
    'no-underscore-dangle': 'off',
    'comma-dangle': 'off',
    'linebreak-style': 'off',
    'no-unused-vars': 'warn',
    'button-has-type': 0,
    'no-useless-constructor': 0,
    'import/no-cycle': 0, // disable dependency cycle for this project
    'import/prefer-default-export': 0, // please use import
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.js',
        '.ts',
      ]
    },
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ts',
        ]
      }
    }
  },
};
