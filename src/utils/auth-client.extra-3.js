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
