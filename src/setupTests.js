import './test/jest-expect-message'
import '@testing-library/jest-dom/extend-expect'
import {queryCache} from 'react-query'
import {setupServer} from 'msw/node'
import {handlers} from './test/server-handlers'

// make debug output for TestingLibrary Errors larger
process.env.DEBUG_PRINT_LIMIT = 15000

// we don't want to start the service worker in tests
// it wouldn't work anyway
jest.mock('./test/server', () => {})

const mockServer = setupServer(...handlers)

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => mockServer.listen())
afterAll(() => mockServer.close())

// allow tests to mock the implementation of window.fetch
beforeEach(() => jest.spyOn(window, 'fetch'))
afterEach(() => window.fetch.mockRestore())

// general cleanup
afterEach(() => {
  window.localStorage.clear()
  queryCache.clear()
})
