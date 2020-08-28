// dynamically export the server based on the environment
// using CommonJS in this file because it's a bit simpler
// even though mixing CJS and ESM is not typically recommended
// It is possible to do this with ESM using `codegen.macro`
// and you can take a look at an example of this here:
// https://github.com/kentcdodds/bookshelf/blob/aef4f122428718ff422e203c6a68301dca50b396/src/test/server/index.js

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev-server')
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test-server')
} else {
  // in normal apps you'll not do anything in this case
  // but for this workshop app, we're actually going to
  // deploy our mock service worker to production
  // so normally, this condition would just look like this:

  // module.exports = ""

  // but for us, since we're shipping the dev server to prod
  // we'll do the same thing we did for development:
  module.exports = require('./dev-server')
}
