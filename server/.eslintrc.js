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
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "lines-between-class-members": 0,
    "no-trailing-spaces": [
      "error",
      {
          "ignoreComments": true
      }
    ],
    "class-methods-use-this": [
        "error",
        {
            "exceptMethods": [
                "authorizationParams"
            ]
        }
    ],
    "@typescript-eslint/no-var-requires": "warn", // please use import
    "no-underscore-dangle": "off",
    "comma-dangle": "off",
    "linebreak-style": "off",
    "no-unused-vars": "warn",
    "button-has-type": 0,
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
