import {queryCache} from 'react-query'
const localStorageKey = '__bookshelf_token__'

async function client(
  endpoint,
  {data, headers: customHeaders, ...customConfig} = {},
) {
  // Ignore this... It's the *only* thing we need to do thanks to the way we
  // handle fetch requests with the service worker. In your apps you shouldn't
  // need to have something like this.
  await window.__bookshelf_serverReady

  const token = window.localStorage.getItem(localStorageKey)

  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async response => {
      if (response.status === 401) {
        logout()
        // refresh the page for them
        window.location.assign(window.location)
        return Promise.reject({message: 'Please re-authenticate.'})
      }
      const data = await response.json()
      if (response.ok) {
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
