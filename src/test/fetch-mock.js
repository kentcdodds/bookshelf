// I use a mock server for development (strongly recommended).
// This file allows me to use the same handlers I use for development
// in my tests (also recommended).
import {response, defaultContext} from 'msw'
import {match} from 'node-match-path'
import {handlers} from './server-handlers'

// borrowed from:
// https://github.com/open-draft/msw/blob/b2c10e623a099e64a7fe3b33aab3a00da4007f17/src/utils/resolveRelativeUrl.ts
const resolveRelativeUrl = mask => {
  return typeof mask === 'string' && mask.startsWith('/')
    ? `${window.location.origin}${mask}`
    : mask
}

const originalFetch = window.fetch

async function fetchMock(url, config) {
  const req = new Request(url, config)

  const json = await req.json().catch(() => void 0)
  const text = await req.text().catch(() => void 0)

  if (json || text) {
    req.body = json || text
  }

  const parsedUrl = new URL(req.url)
  req.query = parsedUrl.searchParams

  const relevantRequestHandler = handlers.find(requestHandler => {
    return requestHandler.predicate(req, parsedUrl)
  })

  if (!relevantRequestHandler) {
    return originalFetch(url, config)
  }

  const {mask, defineContext, resolver} = relevantRequestHandler

  // Retrieve request URL parameters based on the provided mask
  const params = (mask && match(resolveRelativeUrl(mask), req.url).params) || {}

  const requestWithParams = {
    ...req,
    params,
  }

  const context = defineContext
    ? defineContext(requestWithParams)
    : defaultContext

  const mockedResponse = await resolver(requestWithParams, response, context)

  if (!mockedResponse) {
    throw new Error('mock response must exist')
  }

  return new Response(mockedResponse.body, mockedResponse)
}

export {fetchMock}
