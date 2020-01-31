module.exports = (on, config) => {
  const isDev = config.watchForFileChanges
  config.baseUrl = isDev ? 'http://localhost:3000' : 'http://localhost:8811'
  config.integrationFolder = 'cypress/e2e'
  return config
}
