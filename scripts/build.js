const {spawnSync} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')

if (branch.startsWith('exercises/')) {
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
} else {
  spawnSync('npx react-scripts build --profile', {stdio: 'inherit'})
}
