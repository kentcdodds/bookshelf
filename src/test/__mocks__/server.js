import {setupServer} from 'msw/node'
import {handlers} from '../server-handlers'

const server = setupServer(...handlers)

const serverReady = server.listen()

// ensure that the real window.fetch is not called until the server is ready
const originalFetch = window.fetch
window.fetch = async (...args) => {
  await serverReady
  // now that the server is ready, we can restore the original fetch
  window.fetch = originalFetch
  return originalFetch(...args)
}

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => serverReady)
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

export * from 'msw'
export * from 'msw/node'
export {server, serverReady}
