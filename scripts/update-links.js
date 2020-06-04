const path = require('path')
const fs = require('fs')
const {spawnSync} = require('./utils')
const pkg = require(path.join(process.cwd(), 'package.json'))
const {homepage: projectHomepage} = pkg

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
const exerciseNumberRegex = /^exercises\/(\d+)/
const exerciseNumber = exerciseNumberRegex.test(branch)
  ? branch.match(exerciseNumberRegex)[1]
  : null
if (exerciseNumber) {
  const contents = fs.readFileSync('INSTRUCTIONS.md', {encoding: 'utf-8'})
  const newContents = [contents]
    .map(getLinesWithProdDeploys)
    .map(getLinesWithUpdatedFeedbackLink)[0]

  if (contents !== newContents) {
    fs.writeFileSync('INSTRUCTIONS.md', newContents)
  }
}

function getLinesWithProdDeploys(contents) {
  const lines = contents.split('\n')
  const exerciseProdDeployLines = `
Production deploys:

- [Exercise](${projectHomepage}exercise)
- [Final](${projectHomepage})
`
    .trim()
    .split('\n')

  const getExtraDeployLines = extraNumber => [
    `[Production deploy](${projectHomepage}extra-${extraNumber})`,
  ]

  const newLines = []
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    newLines.push(line)

    const extraCreditMatch = line.match(/### (?<number>\d+)\. 💯 /)

    if (/## Exercise$/.test(line)) {
      newLines.push('', ...exerciseProdDeployLines)
      if (lines[lineIndex + 2].startsWith('Production deploys:')) {
        // already existed, skip indexes
        lineIndex = lineIndex + exerciseProdDeployLines.length + 1
      }
    } else if (extraCreditMatch) {
      const number = extraCreditMatch.groups.number
      const extraDeployLines = getExtraDeployLines(number)
      newLines.push('', ...extraDeployLines)
      if (lines[lineIndex + 2].startsWith('[Production deploy]')) {
        // already existed, skip indexes
        lineIndex = lineIndex + extraDeployLines.length + 1
      }
    }
  }
  return newLines.join('\n')
}

function getLinesWithUpdatedFeedbackLink(contents) {
  const feedbackLinkRegex = /^https?:\/\/ws\.kcd\.im.*?&em=$/m

  const firstLine = contents.split('\n')[0]
  const titleMatch = firstLine.match(/# (?<title>.*)$/)
  if (!titleMatch) {
    throw new Error(`Title is invalid`)
  }
  const title = titleMatch.groups.title.trim()
  const workshop = encodeURIComponent('Build React Apps')
  const exercise = encodeURIComponent(`${exerciseNumber}: ${title}`)
  const link = `https://ws.kcd.im/?ws=${workshop}&e=${exercise}&em=`
  if (contents.includes(link)) {
    return contents
  }
  if (!feedbackLinkRegex.test(contents)) {
    throw new Error(
      `Exercise "${exerciseNumber}" is missing workshop feedback link`,
    )
  }
  return contents.replace(feedbackLinkRegex, link)
}
