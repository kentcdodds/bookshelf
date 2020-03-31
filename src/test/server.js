import {composeMocks} from 'msw'
import {handlers} from './server-handlers'

async function setupServer() {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.allSettled(registrations.map(r => r.unregister()))
  } catch (error) {
    console.error('Service Worker unregistration failed: ', error)
  }

  // Start the Service Worker
  return composeMocks(...handlers).start('/mockServiceWorker.js')
}

window.__bookshelf_serverReady = setupServer()
