// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app
const localStorageKey = '__bookshelf_token__'

let token = null

async function getToken() {
  if (token) {
    return token
  }
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  token = window.localStorage.getItem(localStorageKey)
  return token
}

async function isLoggedIn() {
  if (token) {
    return true
  }
  await getToken()
  return Boolean(token)
}

function handleUserResponse({user}) {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

async function getUser() {
  const token = await getToken()
  if (!token) {
    return Promise.resolve(null)
  }
  return client('me').then(
    data => data.user,
    async () => {
      await logout()
      return null
    },
  )
}

function login({username, password}) {
  return client('login', {data: {username, password}}).then(handleUserResponse)
}

function register({username, password}) {
  return client('register', {data: {username, password}}).then(
    handleUserResponse,
  )
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
  token = null
}

export {login, register, getToken, getUser, isLoggedIn, logout}

// an auth provider wouldn't use your client, they'd have their own
// so if this copy/paste client is confusing to you, that's why...
const apiURL = process.env.REACT_APP_API_URL

async function client(
  endpoint,
  {data, headers: customHeaders, ...customConfig} = {},
) {
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

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}
