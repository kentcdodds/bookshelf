import client from './api-client'

const localStorageKey = '__bookshelf_token__'

function handleUserResponse({user: {token, ...user}}) {
  window.localStorage.setItem(localStorageKey, token)
  return user
}

function getUser() {
  const token = getToken()
  if (!token) {
    return Promise.resolve(null)
  }
  return client('me').catch(error => {
    logout()
    return Promise.reject(error)
  })
}

function login({username, password}) {
  return client('login', {body: {username, password}}).then(handleUserResponse)
}

function register({username, password}) {
  return client('register', {body: {username, password}}).then(
    handleUserResponse,
  )
}

function logout() {
  window.localStorage.removeItem(localStorageKey)
  return Promise.resolve()
}

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

export {login, register, logout, getToken, getUser}
