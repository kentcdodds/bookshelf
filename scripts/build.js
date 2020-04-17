const isCI = require('is-ci')
const {spawnSync} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')

if (branch === 'master' || !isCI) {
  spawnSync('npx react-scripts build', {stdio: 'inherit'})
} else {
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
}
