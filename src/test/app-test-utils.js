import React from 'react'
import * as rtl from '@testing-library/react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {ReactQueryConfigProvider} from 'react-query'
import {AuthProvider} from 'context/auth-context'
import {buildUser} from './generate'
import * as usersDB from './data/users'
import * as booksDB from './data/books'

jest.mock('context/auth-context')

const queryConfig = {
  retry: 0,
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function render(
  ui,
  {
    route = '/',
    initialEntries = [route],
    history = createMemoryHistory({initialEntries}),
    ...renderOptions
  } = {},
) {
  function Wrapper({children}) {
    return (
      <ReactQueryConfigProvider config={queryConfig}>
        <Router history={history}>
          <AuthProvider>{children}</AuthProvider>
        </Router>
      </ReactQueryConfigProvider>
    )
  }
  return {
    ...rtl.render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  }
}

async function loginAsUser(user = buildUser()) {
  await usersDB.create(user)
  const authUser = usersDB.authenticate(user)
  window.localStorage.setItem('__bookshelf_token__', authUser.token)
  return authUser
}

// TODO: open an issue on DOM Testing Library to make this built-in...
async function waitForElementToBeRemoved(...args) {
  try {
    await rtl.waitForElementToBeRemoved(...args)
  } catch (error) {
    rtl.screen.debug()
    throw error
  }
}

function getRandomBook() {
  const books = booksDB.query('')
  return books[Math.floor(Math.random() * books.length)]
}

export {default as userEvent} from '@testing-library/user-event'
export * from '@testing-library/react'
export {render, loginAsUser, waitForElementToBeRemoved, getRandomBook}
