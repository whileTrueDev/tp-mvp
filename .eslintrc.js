module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
    es6: true
  },
  plugins: [
    "react",
    "react-hooks",
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'jest'
  ],
  extends: [
    "plugin:react/recommended",
    'airbnb-base',
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
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
      0,
    ],
    '@typescript-eslint/no-var-requires': 'warn', // please use import
    'no-underscore-dangle': 'off',
    'comma-dangle': 'off',
    'linebreak-style': 'off',
    'no-unused-vars': 'off',
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
    ],
    "@typescript-eslint/no-use-before-define": 'off',
    "react/display-name": 0,
    "react/jsx-props-no-spreading": "warn",
    "react/jsx-filename-extension": [
        1,
        {
            "extensions": [
                ".tsx",
                ".jsx"
            ]
        }
    ],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "react/require-default-props": 1,
    "react/prefer-stateless-function": 1,
    "react/forbid-prop-types": [
        0,
        {
            "forbid": [
                "object"
            ]
        }
    ],
    "react/prop-types": [
        1,
        {
            "ignore": [
                "className",
                "children",
                "location",
                "params",
                "location*"
            ]
        }
    ]
  },
  settings: {
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ],
    "import/parsers": {
        "@typescript-eslint/parser": [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
        ]
    },
    "import/resolver": {
        node: {
            extensions: [
                ".js",
                ".jsx",
                ".ts",
                ".tsx"
            ]
        }
    }
  },
};
