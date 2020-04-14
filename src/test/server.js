import {composeMocks} from 'msw'
import {handlers} from './server-handlers'
import {homepage} from '../../package.json'

const fullUrl = new URL(homepage)

async function startServer() {
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
