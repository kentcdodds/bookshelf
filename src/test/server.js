import {composeMocks} from 'msw'
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
  // https://github.com/open-draft/msw/issues/98
  if (!navigator.serviceWorker.controller) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map(r => r.unregister()))
  }
  await composeMocks(...handlers).start(
    fullUrl.pathname + 'mockServiceWorker.js',
  )
}

window.__bookshelf_serverReady = startServer()
