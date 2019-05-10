function client(endpoint, {body, ...config} = {}) {
  const token = window.localStorage.getItem('__bookshelf_token__')
  const headers = {
    ...config.headers,
    'content-type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
      method: body ? 'POST' : 'GET',
      body: JSON.stringify(body),
      ...config,
      headers,
    })
    .then(r => r.json())
}

export default client
