import {client} from '../api-client'

const url = endpoint => `${process.env.REACT_APP_API_URL}/${endpoint}`

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  window.fetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve()})
  await client('foo')
  expect(window.fetch).toHaveBeenCalledTimes(1)
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
})

test('adds auth token when a token is in localStorage', async () => {
  window.localStorage.setItem('__bookshelf_token__', 'FAKE_TOKEN')
  window.fetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve()})
  await client('foo')
  expect(window.fetch).toHaveBeenCalledTimes(1)
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), {
    method: 'GET',
    headers: {
      Authorization: 'Bearer FAKE_TOKEN',
      'content-type': 'application/json',
    },
  })
  window.localStorage.removeItem('__bookshelf_token__')
})

test('allows for config overrides', async () => {
  window.fetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve()})
  await client('foo', {
    credentials: 'omit',
    headers: {'content-type': 'fake-type'},
  })
  expect(window.fetch).toHaveBeenCalledTimes(1)
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), {
    method: 'GET',
    credentials: 'omit',
    headers: {
      'content-type': 'fake-type',
    },
  })
})
