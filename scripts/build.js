const {spawnSync} = require('./utils')

const branch =
  process.env.BRANCH || spawnSync('git rev-parse --abbrev-ref HEAD')

console.log(`Building for branch "${branch}"`)

if (branch.startsWith('exercises/')) {
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
} else {
  spawnSync('npx react-scripts build --profile', {stdio: 'inherit'})
}
