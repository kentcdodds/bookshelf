import React from 'react'
import * as rtl from '@testing-library/react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {buildUser} from './generate'
import * as usersDB from './data/users'

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
    return <Router history={history}>{children}</Router>
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

export {default as userEvent} from '@testing-library/user-event'
export * from '@testing-library/react'
export {render, loginAsUser, waitForElementToBeRemoved}
