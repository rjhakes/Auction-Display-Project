// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow tabs
    'no-tabs': 'off',
    // allow empty lines
    'no-multiple-empty-lines': 'off',
    // allow trailing spaces
    'no-trailing-spaces': 'off',
    // allow no space before function parenthesis
    'space-before-function-paren': 'off',
    // allow mixed spaced and tabs
    'no-mixed-spaces-and-tabs': 'off',
    // give up on trying to standardize indentation
    'indent': 'off',
    // allow ==
    'eqeqeq': 'off',
    // allow single and double quotes
    'quotes': 'off',
    // allow curly brackets where they belong
    'brace-style': 'off'
  }
}
