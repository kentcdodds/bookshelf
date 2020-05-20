import {queryCache} from 'react-query'
const localStorageKey = '__bookshelf_token__'

async function client(endpoint, {body, ...customConfig} = {}) {
  // Ignore this... It's the *only* thing we need to do thanks to the way we
  // handle fetch requests with the service worker. In your apps you shouldn't
  // need to have something like this.
  await window.__bookshelf_serverReady

  const token = window.localStorage.getItem(localStorageKey)
  const headers = {}
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
    config.headers['content-type'] = 'application/json'
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async r => {
      if (r.status === 401) {
        logout()
        // refresh the page for them
        window.location.assign(window.location)
        return Promise.reject({message: 'Please re-authenticate.'})
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
