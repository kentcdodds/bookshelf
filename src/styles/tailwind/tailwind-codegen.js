const {spawnSync} = require('child_process')

function generateTailwindCode() {
  const result = spawnSync(
    './node_modules/.bin/postcss --output node_modules/.cache/app-postcss/styles.css src/styles/tailwind/tailwind.css',
    {stdio: 'ignore', shell: true},
  )
  if (result.status !== 0) {
    console.error(result.stdout)
    console.error(result.stderr)
    throw new Error(`postcss failure. Exit status: ${result.status}`)
  }
  return `require('.cache/app-postcss/styles.css')`
}

module.exports = generateTailwindCode
