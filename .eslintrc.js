module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'standard'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    requireConfigFile: false
  },
  rules: {
  }
}
