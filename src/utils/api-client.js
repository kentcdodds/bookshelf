import {queryCache} from 'react-query'
const localStorageKey = '__bookshelf_token__'

function client(endpoint, {body, ...customConfig} = {}) {
  const token = window.localStorage.getItem(localStorageKey)
  const headers = {'content-type': 'application/json'}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async r => {
      if (r.status === 401) {
        logout()
        // refresh the page for them
        window.location.assign(window.location)
        return
      }
      const data = await r.json()
      if (r.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

function logout() {
  queryCache.clear()
  window.localStorage.removeItem(localStorageKey)
}

export {client, localStorageKey, logout}
