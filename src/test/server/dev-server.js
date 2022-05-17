import {setupWorker} from 'msw'
import {handlers} from './server-handlers'
import pkg from '../../../package.json'

const fullUrl = new URL(pkg.homepage)

const server = setupWorker(...handlers)

server.start({
  quiet: true,
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: fullUrl.pathname + 'mockServiceWorker.js',
  },
})

export * from 'msw'
export {server}
