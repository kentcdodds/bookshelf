const {spawnSync} = require('./utils')

const branch =
  process.env.BRANCH || spawnSync('git rev-parse --abbrev-ref HEAD')

if (branch.startsWith('exercise/')) {
  console.log(`Building varients for ${branch}`)
  spawnSync('node ./scripts/build-variants', {stdio: 'inherit'})
} else {
  console.log(`Building app for ${branch}`)
  spawnSync('npx react-scripts build --profile', {stdio: 'inherit'})
}
