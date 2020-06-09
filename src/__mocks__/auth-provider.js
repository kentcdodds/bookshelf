import {buildUser} from 'test/generate'
import * as usersDB from 'test/data/users'

const actualAuthProvider = jest.requireActual('auth-provider')

// this function will differ based on what auth provider you're using
// but this is conceptually what you'd need.
async function loginAsUser(userProperties) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = usersDB.authenticate(user)
  const fullUser = {...user, ...authUser}
  window.localStorage.setItem(
    actualAuthProvider.localStorageKey,
    authUser.token,
  )
  return fullUser
}

const _mock = {loginAsUser}

// it's possible you'd want to override other methods in your situation as well.
module.exports = {...actualAuthProvider, _mock}
