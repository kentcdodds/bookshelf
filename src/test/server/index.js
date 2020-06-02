import codegen from 'codegen.macro'

// using codegen here is useful because it means that when webpack or jest
// handle this module, all they see is something like: "export * from './dev-server'"
// so there's no need for dynamic require statements

codegen`
if (process.env.NODE_ENV === 'development') {
  module.exports = "export * from './dev-server'"
} else if (process.env.NODE_ENV === 'test') {
  module.exports = "export * from './test-server'"
} else {
  // in normal apps you'll not do anything in this case
  // but for this workshop app, we're actually going to
  // deploy our mock service worker to production
  // so normally, this condition would just look like this:

  // module.exports = ""

  // but for us, since we're shipping the dev server to prod
  // we'll do the same thing we did for development:
  module.exports = "export * from './dev-server'"
}
`
