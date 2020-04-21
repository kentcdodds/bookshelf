import {client, localStorageKey} from './api-client'

function handleUserResponse({user: {token, ...user}}) {
  window.localStorage.setItem(localStorageKey, token)
  return user
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

export {login, register, logout}
