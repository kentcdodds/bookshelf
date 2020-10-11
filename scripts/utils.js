const path = require('path')
const cp = require('child_process')
const fs = require('fs')
const glob = require('glob')

function spawnSync(command, options) {
  const result = cp.spawnSync(command, {shell: true, stdio: 'pipe', ...options})
  result.stdout = result.stdout || ''
  result.stderr = result.stderr || ''
  if (result.status === 0) {
    return result.stdout.toString().trim()
  } else {
    throw new Error(
      `\n\nError executing command: ${command}\n\nERROR CODE: ${result.status}\n\nSTDERR:\n${result.stderr}\n\nSTDOUT:\n${result.stdout}`,
    )
  }
}

function getExtraCreditNumberFromFilename(line) {
  const m = line.match(/\.extra-(?<number>\d+).js$/)
  if (!m) {
    return null
  }
  return Number(m.groups.number)
}

function getExtraCreditTitles() {
  const instructions = fs.readFileSync('INSTRUCTIONS.md', {encoding: 'utf-8'})
  return instructions
    .split('\n')
    .filter(l => l.includes('💯'))
    .map(l => l.replace(/^.*💯/, '').trim())
}

function getVariants() {
  const extraCreditTitles = getExtraCreditTitles()
  const files = glob.sync('./+(src|cypress)/**/*.+(exercise|final|extra-)*.js')
  const filesByMaster = {}
  for (const file of files) {
    const {dir, name, base, ext} = path.parse(file)
    const contents = fs.readFileSync(file).toString()
    const hasDefaultExport = /^export default /m.test(contents)
    const hasCJSExport = /^module.exports /m.test(contents)
    let exportLines = [
      `export * from './${name}'`,
      hasDefaultExport ? `export {default} from './${name}'` : null,
    ].filter(Boolean)
    if (hasCJSExport) {
      exportLines = [`module.exports = require('./${name}')`]
    }
    const number = getExtraCreditNumberFromFilename(base)
    const main = path.join(dir, name.replace(/\..*$/, ext))

    filesByMaster[main] = filesByMaster[main] || {extras: []}

    const info = {
      exportLines,
      number,
      title: extraCreditTitles[number - 1],
      file,
    }

    if (base.includes('.final')) filesByMaster[main].final = info
    if (base.includes('.exercise')) filesByMaster[main].exercise = info
    if (base.includes('.extra')) filesByMaster[main].extras.push(info)
  }
  return filesByMaster
}

function getExerciseBranches() {
  const branches = spawnSync(
    `git for-each-ref --format="%(refname:short)"`,
  ).split('\n')
  return branches
    .filter(b => b.startsWith('origin/exercises/'))
    .map(b => b.replace('origin/', ''))
}

function updateExerciseBranch(branch) {
  const mainCommit = spawnSync('git rev-parse main')
  spawnSync(`git checkout ${branch}`)
  const exerciseCommit = spawnSync(`git rev-parse ${branch}`)
  const parentCommit = spawnSync(`git rev-parse ${branch}^`)
  if (mainCommit === parentCommit) {
    return false
  }
  console.log(
    `> The ${branch} exercise commit SHA: ${exerciseCommit} (save this in case something goes wrong).`,
  )
  spawnSync(`git reset --hard main`)
  try {
    const result = spawnSync(
      `git cherry-pick ${exerciseCommit} --strategy-option theirs`,
    )
    if (!result.includes('error: could not apply')) {
      return true
    }
  } catch (error) {
    // let's try to fix things maybe... This might be a terrible idea though..
  }
  // the conflict is probably because files were deleted in the branch and we
  // should delete them again. For some reason --strategy-option theres doesn't
  // do this by default. 🤔
  spawnSync(`git status | sed -n 's/deleted by them://p' | xargs git rm`)
  const status = spawnSync('git status')
  if (
    status.includes('Changes not staged for commit') ||
    status.includes('Unmerged')
  ) {
    console.error(
      '❌  Merge conflict. Fix the conflict, then run the update-exercises script again to be sure you have everything up to date.',
    )
    throw status
  }
  spawnSync(`git cherry-pick --quit`)
  spawnSync(`git commit -am "${branch}"`)
  return true
}

module.exports = {
  spawnSync,
  getVariants,
  getExtraCreditTitles,
  getExerciseBranches,
  updateExerciseBranch,
}
