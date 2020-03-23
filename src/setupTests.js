import '@testing-library/jest-dom/extend-expect'
import {queryCache} from 'react-query'

// none of these tests should actually invoke fetch
beforeEach(() => {
  jest.spyOn(window, 'fetch').mockImplementation((...args) => {
    console.warn('window.fetch is not mocked for this call', ...args)
    return Promise.reject(new Error('This must be mocked!'))
  })
})

afterEach(() => {
  window.fetch.mockRestore()
})

afterEach(() => {
  queryCache.clear()
})
