import React from 'react'
import * as rtl from '@testing-library/react'
import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter as Router} from 'react-router-dom'
import {ReactQueryConfigProvider, queryCache} from 'react-query'
import {AuthProvider} from 'context/auth-context'
import {buildUser} from './generate'
import * as usersDB from './data/users'
import * as booksDB from './data/books'

const queryConfig = {
  retry: 0,
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

async function render(
  ui,
  {route = '/list', initialEntries = [route], user, ...renderOptions} = {},
) {
  // if you want to render the app unauthenticated then pass "null" as the user
  user = typeof user === 'undefined' ? await loginAsUser() : user

  function Wrapper({children}) {
    return (
      <ReactQueryConfigProvider config={queryConfig}>
        <Router initialEntries={initialEntries}>
          <AuthProvider>{children}</AuthProvider>
        </Router>
      </ReactQueryConfigProvider>
    )
  }

  const returnValue = {
    ...rtl.render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    user,
  }

  // wait for react-query to settle before allowing the test to continue
  await waitForLoadingToFinish()

  return returnValue
}

async function loginAsUser(user = buildUser()) {
  await usersDB.create(user)
  const authUser = usersDB.authenticate(user)
  user = {...user, ...authUser}
  window.localStorage.setItem('__bookshelf_token__', authUser.token)
  // AuthProvider.__mock.mockValue.user = user
  return user
}

// TODO: open an issue on DOM Testing Library to make this built-in...
async function waitForElementToBeRemoved(...args) {
  try {
    await rtl.waitForElementToBeRemoved(...args)
  } catch (error) {
    screen.debug()
    throw error
  }
}

const waitForLoadingToFinish = () =>
  waitFor(
    () => {
      if (queryCache.isFetching) {
        throw new Error('The react-query queryCache is still fetching')
      }
      if (
        screen.queryByLabelText(/loading/i) ||
        screen.queryByText(/loading/i)
      ) {
        throw new Error('App loading indicators are still running')
      }
    },
    {timeout: 4000},
  )

function getRandomBook() {
  const books = booksDB.query('')
  return books[Math.floor(Math.random() * books.length)]
}

export * from '@testing-library/react'
export {
  render,
  userEvent,
  loginAsUser,
  waitForElementToBeRemoved,
  waitForLoadingToFinish,
  getRandomBook,
}
