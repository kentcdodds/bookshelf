const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const {spawnSync, getExtraCreditTitles} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'main') {
  console.log('Cannot run swap on main as there are no exercises.')
} else {
  go()
}

function go() {
  const variants = [
    'exercise',
    ...getExtraCreditTitles().map((x, i) => i + 1),
    'final',
  ]

  const originalHomepage = pkg.homepage

  function updateHomepage(pathname = '') {
    const url = new URL(originalHomepage)
    // must end in "/"
    url.pathname = pathname.endsWith('/') ? pathname : `${pathname}/`
    const newHomepage = url.toString()
    fs.writeFileSync(
      'package.json',
      JSON.stringify({...pkg, homepage: newHomepage}, null, 2) + '\n',
    )
  }

  const buildPath = path.join('node_modules', '.cache', 'build')
  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath, {recursive: true})
  }

  function getRedirect(baseRoute) {
    baseRoute = baseRoute.endsWith('/') ? baseRoute : `${baseRoute}/`
    baseRoute = baseRoute.startsWith('/') ? baseRoute : `/${baseRoute}`
    return `
${baseRoute}*       ${baseRoute}index.html        200
    `.trim()
  }

  let redirects = []

  const getDirname = variant =>
    typeof variant === 'number' ? `extra-${variant}` : variant

  function buildVariant(variant, {dirname = getDirname(variant)} = {}) {
    console.log(`▶️  Starting build for "${variant}" in "${dirname}"`)
    try {
      updateHomepage(dirname)
      spawnSync(`node ./scripts/swap ${variant}`, {stdio: 'inherit'})
      spawnSync(`npx react-scripts build --profile`, {stdio: 'inherit'})
      if (variant !== 'exercise') {
        spawnSync(`npm run test:coverage`, {stdio: 'inherit'})
      }
      if (dirname) {
        const dirPath = path.join('node_modules', '.cache', 'build', dirname)
        if (fs.existsSync(dirPath)) {
          fs.rmdirSync(dirPath, {recursive: true})
        }
        fs.renameSync('build', dirPath)
      }
      console.log(`✅  finished build for "${variant}" in "${dirname}"`)
      redirects.push(getRedirect(dirname))
    } catch (error) {
      console.log(`🚨  error building for "${variant}" in "${dirname}"`)
      throw error
    }
  }

  for (const variant of variants) {
    buildVariant(variant)
  }

  // build the final as the main thing with the homepage set to the root
  buildVariant('final', {dirname: ''})

  console.log(
    '✅  all variants have been built, moving them to build and creating redirects file',
  )
  for (const variant of variants) {
    const dirname = getDirname(variant)
    const oldPath = path.join('node_modules', '.cache', 'build', dirname)
    const newPath = path.join('build', dirname)
    fs.renameSync(oldPath, newPath)
  }
  fs.writeFileSync('build/_redirects', redirects.join('\n\n'))
  console.log('✅  all done. Ready to deploy')
}
