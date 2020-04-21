#!/usr/bin/env node

const inquirer = require('inquirer')
const {
  spawnSync,
  getExerciseBranches,
  getVariants,
  getExtraCreditTitles,
} = require('./scripts/utils')

const actions = {
  changeExercise,
  startExtraCredit,
}

async function go() {
  const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
  if (branch === 'master') {
    // if we're on master then you can't do anything else
    await changeExercise()
    return
  }

  const {action} = await inquirer.prompt([
    {
      name: 'action',
      message: `What do you want to do?`,
      type: 'list',
      choices: [
        {name: 'Change Exercise', value: 'changeExercise'},
        {name: 'Start Extra Credit', value: 'startExtraCredit'},
      ],
    },
  ])
  await actions[action]()
}

function getDisplayName(exerciseBranch) {
  const match = exerciseBranch.match(
    /exercises\/(?<number>\d\d)-(?<title>.*?)$/,
  )
  const title = match.groups.title.split('-').join(' ')
  const capitalizedTitle = title.slice(0, 1).toUpperCase() + title.slice(1)
  return `${match.groups.number}. ${capitalizedTitle}`
}

async function changeExercise() {
  const {branch} = await inquirer.prompt([
    {
      name: 'branch',
      message: `Which exercise do you want to start working on?`,
      type: 'list',
      choices: getExerciseBranches().map(b => ({
        name: getDisplayName(b),
        value: b,
      })),
    },
  ])
  spawnSync('git reset --hard HEAD')
  spawnSync(`git checkout ${branch}`)
  spawnSync('node ./scripts/swap exercise')
  console.log(`✅  Ready to start work in ${branch}`)
}

async function startExtraCredit() {
  const variants = getVariants()
  const maxExtra = Math.max(
    ...Object.values(variants)
      .flatMap(v => v.extras)
      .map(e => e.number),
  )

  const extraCreditTitles = getExtraCreditTitles()

  const {extraCreditNumber} = await inquirer.prompt([
    {
      name: 'extraCreditNumber',
      message: `Which extra credit do you want to work on?`,
      type: 'list',
      choices: [
        ...Array.from({length: maxExtra}, (v, i) => ({
          name: `Extra Credit ${i + 1}: ${extraCreditTitles[i]}`,
          value: i + 1,
        })),
      ],
    },
  ])

  console.log(extraCreditNumber)
}

go()
