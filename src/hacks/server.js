import {composeMocks, rest} from 'msw'
// import qs from 'querystringify'
// import matchSorter from 'match-sorter'
// import allBooks from './data/books.json'
// import * as listItems from './data/list-items'
import * as users from './data/users'

const sleep = (t = Math.random() * 200 + 300) =>
  new Promise(resolve => setTimeout(resolve, t))

const apiUrl = process.env.REACT_APP_API_URL

// delete this when https://github.com/open-draft/msw/issues/69 is sovled
const originalWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('nmp')) {
    return
  }
  return originalWarn(...args)
}

console.log(`${apiUrl}/me`)

const {start} = composeMocks(
  rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
    await sleep()
    const user = getUser(req)
    return res(ctx.json({user}))
  }),

  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    await sleep()
    const {username, password} = req.body
    const user = users.authenticate({username, password})
    return res(ctx.json({user}))
  }),

  rest.post(`${apiUrl}/register`, async (req, res, ctx) => {
    await sleep()
    const {username, password} = req.body
    if (!username) {
      return res(ctx.status(400), ctx.json({message: 'A username is required'}))
    }
    if (!password) {
      return res(ctx.status(400), ctx.json({message: 'A password is required'}))
    }
    const userFields = {username, password}
    users.create(userFields)
    const user = users.authenticate(userFields)
    return res(ctx.json({user}))
  }),
)

function getUser(req) {
  const token = req.headers.get('Authorization').replace('Bearer ', '')
  if (!token) {
    throw new Error('A token must be provided')
  }
  let userId
  try {
    userId = atob(token)
  } catch (error) {
    throw new Error('Invalid token. Please login again.')
  }
  return users.read(userId)
}

// Start the Service Worker
start('/msw.js')
