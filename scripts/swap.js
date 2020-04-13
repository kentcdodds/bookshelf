const cp = require('child_process')
const fs = require('fs')
const glob = require('glob')

const execSync = (...args) =>
  cp
    .execSync(...args)
    .toString()
    .trim()

const branch = execSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'master') {
  throw new Error('Cannot run swap on master as there are no exercises.')
}

const files = glob.sync('./src/**/*.*')

const {2: match} = process.argv

const allowedTypes = [/^exercise$/, /^final$/, /^\d+$/]

if (!match) {
  throw new Error('a match argument is required')
}

if (!allowedTypes.some(t => t.test(match))) {
  throw new Error(
    `The given match of "${match}" is not one of the allowed types of: ${allowedTypes.join(
      ', ',
    )}`,
  )
}

function getExtraCreditNumber(line) {
  const m = line.match(/\.extra-(?<number>\d+)'$/)
  if (!m) {
    return null
  }
  return Number(m.groups.number)
}
const desiredECNumber = Number(match)

console.log(`Changing used files to those matching "${match}"`)

function isDesiredLine(line, lines) {
  if (match === 'exercise') return line.includes('.exercise')
  if (match === 'final') return line.includes('.final')
  if (Number.isFinite(desiredECNumber)) {
    // We need to return true for the extra credit that either matches the
    // number or is next highest number where "final" represents 0
    // To do this, we'll iterate through them, reversed
    let correctLine
    for (let num = desiredECNumber; num >= 0; num--) {
      if (num === 0) {
        correctLine = lines.find(l => l.includes('.final'))
      } else {
        correctLine = lines.find(l => getExtraCreditNumber(l) === num)
      }
      if (correctLine) {
        return line === correctLine
      }
    }
  }
  return false
}

for (const file of files) {
  const contents = fs.readFileSync(file).toString()
  const lines = contents.split('\n')
  const newLines = lines.map(line => {
    let newLine = line
    if (/(export|import).*\.(exercise|final|extra-\d+)'$/.test(line)) {
      if (isDesiredLine(line, lines)) {
        newLine = line.replace('// ', '')
      } else if (!line.startsWith('// ')) {
        newLine = `// ${line}`
      }
    }
    return newLine
  })
  const newContents = newLines.join('\n')
  fs.writeFileSync(file, newContents)
}
