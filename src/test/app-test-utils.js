import * as rtl from '@testing-library/react'
import {buildUser} from './generate'
import * as usersDB from './data/users'

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
export {loginAsUser, waitForElementToBeRemoved}
