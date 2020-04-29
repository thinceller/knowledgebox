/* eslint-disable */
// ref: https://www.npmjs.com/package/next-transpile-modules
const withTM = require('next-transpile-modules')(['lodash-es'])

module.exports = withTM({
  env: {
    API_HOST: process.env.API_HOST || 'http://localhost:1323'
  }
})
