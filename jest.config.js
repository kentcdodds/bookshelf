const fs = require('fs')
const path = require('path')
const resolve = require('resolve')

process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''

require('react-scripts/config/env')

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js'],
  testEnvironment: resolve.sync('jest-environment-jsdom', {
    basedir: require.resolve('jest'),
  }),

  // this testPathIgnorePatterns config just makes things work with the way we
  // have to do things for this workshop to work. You shouldn't need this in
  // your own jest config. NOTE: This is the *entire* reason we need a custom
  // jest config. Otherwise we'd be able to use regular react-scripts
  // so in your apps, react-scripts should work just fine.
  testPathIgnorePatterns: [
    '/node_modules/',
    'exercise\\.js$',
    'final\\.js$',
    'extra-\\d+\\.js$',
  ],
  setupFiles: [require.resolve('whatwg-fetch')],
  // some of the exercise branches don't have setupTests.js
  setupFilesAfterEnv: fs.existsSync('src/setupTests.js')
    ? ['<rootDir>/src/setupTests.js']
    : [],
  moduleDirectories: ['node_modules', path.join(__dirname, './src')],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': require.resolve(
      'react-scripts/config/jest/babelTransform',
    ),
    '^.+\\.css$': require.resolve('react-scripts/config/jest/cssTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': require.resolve(
      'react-scripts/config/jest/fileTransform.js',
    ),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  resetMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!<rootDir>/node_modules/**/*',
    '!<rootDir>/src/test/**/*',
    '!<rootDir>/src/setupProxy*',
    '!<rootDir>/src/setupTests*',
    '!<rootDir>/src/dev-tools/**/*',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
