import '@testing-library/jest-dom/extend-expect'
import {queryCache} from 'react-query'
import {fetchMock} from './test/fetch-mock'

// we don't want to start the service worker in tests
// it wouldn't work anyway
jest.mock('./test/server', () => {})

// instead, we'll use the same handlers we use for the service worker
// as a mock fetch
beforeEach(() => {
  jest.spyOn(window, 'fetch').mockImplementation(fetchMock)
})

afterEach(() => {
  window.fetch.mockRestore()
  window.localStorage.clear()
  queryCache.clear()
  jest.clearAllMocks()
})
