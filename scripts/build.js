const {spawnSync} = require('./utils')

const branch =
  process.env.BRANCH || spawnSync('git rev-parse --abbrev-ref HEAD')

if (branch.startsWith('exercise/')) {
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
} else {
  spawnSync('npx react-scripts build --profile', {stdio: 'inherit'})
}
