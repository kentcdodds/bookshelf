import '@testing-library/jest-dom/extend-expect'
import {configure, act, waitFor} from '@testing-library/react'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'
import {server} from 'test/server'
import * as usersDB from 'test/data/users'
import * as listItemsDB from 'test/data/list-items'
import * as booksDB from 'test/data/books'

// we don't need the profiler in tests
jest.mock('components/profiler')

// set the location to the /list route as we auto-redirect users to that route
window.history.pushState({}, 'Home page', '/list')

// speeds up *ByRole queries a bit
// https://github.com/testing-library/dom-testing-library/issues/552
configure({defaultHidden: true})

// make debug output for TestingLibrary Errors larger
process.env.DEBUG_PRINT_LIMIT = 15000

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// real times is a good default to start, individual tests can
// enable fake timers if they need.
afterEach(async () => {
  if (setTimeout._isMockFunction) {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  }
})

// general cleanup
afterEach(async () => {
  queryCache.clear()
  // this allows react-query to settle any scheduled work
  // this is not a great solution, but is a good stopgap until a better one
  // is developed: https://github.com/tannerlinsley/react-query/pull/909#issuecomment-683178702
  await waitFor(() => {})
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ])
})
