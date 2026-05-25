module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      files: ['api/**/*.js', '*.config.js', '*.config.mjs', '.eslintrc.js'],
      env: { node: true, es2021: true },
      parserOptions: { sourceType: 'script' },
      rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off',
      },
    },
    {
      files: ['pro/**/*.js', 'pro/**/*.jsx'],
      env: { browser: true, es2021: true },
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: ['react', 'react-hooks'],
      extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
      settings: { react: { version: 'detect' } },
      rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['*.test.js', '*.test.jsx'],
      env: { mocha: true, jest: true },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
