import {client, localStorageKey} from './api-client'

function handleUserResponse({user: {token, ...user}}) {
  window.localStorage.setItem(localStorageKey, token)
  return user
}

function getUser() {
  const token = getToken()
  if (!token) {
    return Promise.resolve(null)
  }
  return client('me').then(data => data.user)
}

function login({username, password}) {
  return client('login', {data: {username, password}}).then(handleUserResponse)
}

function register({username, password}) {
  return client('register', {data: {username, password}}).then(
    handleUserResponse,
  )
}

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function isLoggedIn() {
  return Boolean(getToken())
}

export {login, register, getToken, getUser, isLoggedIn}
export {logout} from './api-client'
