const isCI = require('is-ci')

module.exports = (on, config) => {
  const isDev = config.watchForFileChanges
  if (!isCI) {
    config.baseUrl = isDev ? 'http://localhost:3000' : 'http://localhost:8811'
  }
  Object.assign(config, {
    integrationFolder: 'cypress/e2e',
    ignoreTestFiles: '**/*.+(exercise|final|extra-)*.js',
  })

  return config
}
