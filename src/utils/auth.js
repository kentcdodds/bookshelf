import client from './api-client'

const localStorageKey = '__bookshelf_token__'

function handleUserResponse({token, ...user}) {
  window.localStorage.setItem(localStorageKey, token)
  return user
}

function getUser() {
  return client('me')
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
}

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

export {login, register, logout, getToken, getUser}
