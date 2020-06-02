import '@testing-library/jest-dom/extend-expect'
import {configure} from '@testing-library/react'
import {queryCache} from 'react-query'
import './test/server'

// swap the server with the mock server
jest.mock('./test/server')

// set the location to the /list route as we auto-redirect users to that route
window.history.pushState({}, 'Home page', '/list')

// speeds up *ByRole queries a bit
// https://github.com/testing-library/dom-testing-library/issues/552
configure({defaultHidden: true})

// make debug output for TestingLibrary Errors larger
process.env.DEBUG_PRINT_LIMIT = 15000

// general cleanup
afterEach(() => {
  window.localStorage.clear()
  queryCache.clear()
})
