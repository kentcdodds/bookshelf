import {setupWorker} from 'msw'
import {handlers} from './server-handlers'
import {homepage} from '../../package.json'

const fullUrl = new URL(homepage)

async function startServer() {
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
  await setupWorker(...handlers).start({
    quiet: true,
    serviceWorker: {
      url: fullUrl.pathname + 'mockServiceWorker.js',
    },
  })
}

window.__bookshelf_serverReady = startServer()
