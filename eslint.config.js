// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  // your config
  // https://eslint.vuejs.org/user-guide/#usage
  rules: {
    // override rules
    'no-console': 'off',
  },
})
