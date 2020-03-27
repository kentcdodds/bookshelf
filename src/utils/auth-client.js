import {queryCache} from 'react-query'
import {client} from './api-client'

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
  queryCache.clear()
  window.localStorage.removeItem(localStorageKey)
}

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function isLoggedIn() {
  return Boolean(getToken())
}

export {login, register, logout, getToken, getUser, isLoggedIn}
