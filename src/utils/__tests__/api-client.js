import {queryCache} from 'react-query'
import {client, localStorageKey} from '../api-client'

jest.mock('react-query')

const url = endpoint => `${process.env.REACT_APP_API_URL}/${endpoint}`
const defaultConfig = {method: 'GET', headers: {}}
const defaultResult = {mockValue: 'VALUE'}
const defaultResponse = {
  ok: true,
  json: () => Promise.resolve(defaultResult),
}

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  window.fetch.mockResolvedValueOnce(defaultResponse)
  const result = await client('foo')
  expect(result).toEqual(defaultResult)
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), defaultConfig)
  expect(window.fetch).toHaveBeenCalledTimes(1)
})

test('adds auth token when a token is in localStorage', async () => {
  const token = 'FAKE_TOKEN'
  window.localStorage.setItem(localStorageKey, token)
  window.fetch.mockResolvedValueOnce(defaultResponse)
  await client('foo')
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), {
    ...defaultConfig,
    headers: {
      ...defaultConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  })
})

test('allows for config overrides', async () => {
  window.fetch.mockResolvedValueOnce(defaultResponse)

  const customConfig = {
    credentials: 'omit',
    headers: {'Content-Type': 'fake-type'},
  }
  await client('foo', customConfig)
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), {
    ...defaultConfig,
    ...customConfig,
    headers: {...defaultConfig.headers, ...customConfig.headers},
  })
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const data = {a: 'b'}
  window.fetch.mockResolvedValueOnce(defaultResponse)
  await client('foo', {data})
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), {
    ...defaultConfig,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

test('automatically logs the user out if a request returns a 401', async () => {
  window.localStorage.setItem(localStorageKey, 'FAKE_TOKEN')
  window.fetch.mockResolvedValueOnce({ok: false, status: 401})
  const error = await client('foo').catch(e => e)

  expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate."`)

  expect(queryCache.clear).toHaveBeenCalledTimes(1)
  expect(window.localStorage.getItem(localStorageKey)).toBe(null)
})

test(`correctly rejects the promise if there's an error`, async () => {
  const testError = {message: 'Test error'}
  window.fetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: () => Promise.resolve(testError),
  })
  const error = await client('foo').catch(e => e)

  expect(error).toEqual(testError)
})
