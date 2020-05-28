import {queryCache} from 'react-query'
import {render as rtlRender, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AppProviders} from 'context'
import {localStorageKey} from 'utils/api-client'
import {buildUser} from './generate'
import * as usersDB from './data/users'

async function render(ui, {route = '/list', user, ...renderOptions} = {}) {
  // if you want to render the app unauthenticated then pass "null" as the user
  user = typeof user === 'undefined' ? await loginAsUser() : user
  window.history.pushState({}, 'Test page', route)

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProviders,
      ...renderOptions,
    }),
    user,
  }

  // wait for react-query to settle before allowing the test to continue
  await waitForLoadingToFinish()

  return returnValue
}

async function loginAsUser(userProperties) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = usersDB.authenticate(user)
  const fullUser = {...user, ...authUser}
  window.localStorage.setItem(localStorageKey, authUser.token)
  return fullUser
}

function waitForLoadingToFinish() {
  return waitFor(
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
}

export * from '@testing-library/react'
export {render, userEvent, loginAsUser, waitForLoadingToFinish}
