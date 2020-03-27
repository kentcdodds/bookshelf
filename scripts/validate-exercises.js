const fs = require('fs')
const glob = require('glob')

const files = glob.sync('./src/**/*.*')

const errors = []
for (const file of files) {
  const contents = fs.readFileSync(file).toString()
  if (/^export.*\.(exercise|extra-\d+)'$/gim.test(contents)) {
    errors.push(`This file is exporting a non-final version: ${file}`)
  }
  if (
    /^import.*\.(final|exercise|extra-\d+)'$/gim.test(contents) ||
    /^\} from '.*\.(final|exercise|extra-\d+)'$/gim.test(contents)
  ) {
    errors.push(`This file is importing the wrong version: ${file}`)
  }
}

if (errors.length) {
  throw new Error(errors.join('\n'))
}
