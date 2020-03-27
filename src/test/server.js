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
  const result = await composeMocks(...handlers).start('/mockServiceWorker.js')

  // https://github.com/open-draft/msw/issues/73
  await new Promise(resolve => setTimeout(resolve, 500))

  return result
}

window.__bookshelf_serverReady = setupServer()
