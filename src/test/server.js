import {setupWorker} from 'msw'
import {handlers} from './server-handlers'
import {homepage} from '../../package.json'

const fullUrl = new URL(homepage)

const server = setupWorker(...handlers)

if (!navigator.serviceWorker) {
  if (
    window.location.protocol !== 'https:' &&
    window.location.hostname !== 'localhost'
  ) {
    const currentURL = new URL(window.location.toString())
    currentURL.protocol = 'https:'
    window.location.replace(currentURL.toString())
  }
  throw new Error('This app requires service worker support (over HTTPS).')
}

window.__bookshelf_serverReady = server.start({
  quiet: true,
  serviceWorker: {
    url: fullUrl.pathname + 'mockServiceWorker.js',
  },
})

export * from 'msw'
export {server}
