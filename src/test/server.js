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

const serverReady = server.start({
  quiet: true,
  serviceWorker: {
    url: fullUrl.pathname + 'mockServiceWorker.js',
  },
})

// ensure that the real window.fetch is not called until the server is ready
const originalFetch = window.fetch
window.fetch = async (...args) => {
  await serverReady
  // now that the server is ready, we can restore the original fetch
  window.fetch = originalFetch
  return originalFetch(...args)
}

export * from 'msw'
export {server, serverReady}
