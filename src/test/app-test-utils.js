import {queryCache} from 'react-query'
import {render as rtlRender, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AppProviders} from 'context'
import * as auth from 'auth-provider'

// NOTE: remember that auth-provider simply represents a third party provider
// which you'll probably install via npm. This means that the "auth-provider"
// module would actually be a node_module, in which case, if you have a
// __mocks__ directory (like we have for the auth-provider), the mock will be
// picked up automatically. Because ours is actually mocking a module in our
// source code, we have to mock it manually like so:
jest.mock('auth-provider')
// 📜 https://jestjs.io/docs/en/manual-mocks#mocking-node-modules

const loginAsUser = auth._mock.loginAsUser

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
