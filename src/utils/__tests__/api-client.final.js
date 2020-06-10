import {client} from '../api-client'

const url = endpoint => `${process.env.REACT_APP_API_URL}/${endpoint}`
const defaultConfig = {method: 'GET', headers: {}}
const defaultResult = {mockValue: 'VALUE'}
const defaultResponse = {
  ok: true,
  json: () => Promise.resolve(defaultResult),
}

beforeEach(() => jest.spyOn(window, 'fetch'))
afterEach(() => window.fetch.mockRestore())

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  window.fetch.mockResolvedValueOnce(defaultResponse)
  const result = await client('foo')
  expect(result).toEqual(defaultResult)
  expect(window.fetch).toHaveBeenCalledWith(url('foo'), defaultConfig)
  expect(window.fetch).toHaveBeenCalledTimes(1)
})

test('adds auth token when a token is provided', async () => {
  const token = 'FAKE_TOKEN'
  window.fetch.mockResolvedValueOnce(defaultResponse)
  await client('foo', {token})
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
    mode: 'cors',
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
