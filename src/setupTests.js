import './test/jest-expect-message'
import '@testing-library/jest-dom/extend-expect'
import {configure} from '@testing-library/react'
import {queryCache} from 'react-query'
import {setupServer} from 'msw/node'
import {handlers} from './test/server-handlers'

// set the location to the /list route as we auto-redirect users to that route
window.history.pushState({}, 'Home page', '/list')

// speeds up *ByRole queries a bit
// https://github.com/testing-library/dom-testing-library/issues/552
configure({defaultHidden: true})

// make debug output for TestingLibrary Errors larger
process.env.DEBUG_PRINT_LIMIT = 15000

// we don't want to start the service worker in tests
// it wouldn't work anyway
jest.mock('./test/server', () => {})

const mockServer = setupServer(...handlers)
const serverReady = mockServer.listen()
window.__bookshelf_serverReady = serverReady

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => serverReady)
afterAll(() => mockServer.close())

// allow tests to mock the implementation of window.fetch
beforeEach(() => jest.spyOn(window, 'fetch'))
afterEach(() => window.fetch.mockRestore())

// general cleanup
afterEach(() => {
  window.localStorage.clear()
  queryCache.clear()
})
