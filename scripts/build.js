const {spawnSync} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')

if (branch.startsWith('exercise/')) {
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
} else {
  spawnSync('npx react-scripts build', {stdio: 'inherit'})
}
