const isCI = require('is-ci')
const {spawnSync} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')

if (branch === 'master' || !isCI) {
  spawnSync('react-scripts build', {stdio: 'inherit'})
} else {
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
}
