// istanbul ignore file
import {rest} from 'msw'
import * as booksDB from './data/books'
import * as usersDB from './data/users'
import * as listItemsDB from './data/list-items'

let sleep
if (process.env.NODE_ENV === 'test') {
  sleep = () => Promise.resolve()
} else {
  sleep = (t = Math.random() * 200 + 300) =>
    new Promise(resolve => setTimeout(resolve, t))
}

const apiUrl = process.env.REACT_APP_API_URL

const handlers = [
  rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
    const user = getUser(req)
    await sleep()
    return res(ctx.json({user}))
  }),

  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    const {username, password} = req.body
    const user = usersDB.authenticate({username, password})
    await sleep()
    return res(ctx.json({user}))
  }),

  rest.post(`${apiUrl}/register`, async (req, res, ctx) => {
    const {username, password} = req.body
    if (!username) {
      return res(ctx.status(400), ctx.json({message: 'A username is required'}))
    }
    if (!password) {
      return res(ctx.status(400), ctx.json({message: 'A password is required'}))
    }
    const userFields = {username, password}
    usersDB.create(userFields)
    let user
    try {
      user = usersDB.authenticate(userFields)
    } catch (error) {
      return res(ctx.status(400), ctx.json({message: error.message}))
    }
    await sleep()
    return res(ctx.json({user}))
  }),

  rest.get(`${apiUrl}/books`, async (req, res, ctx) => {
    if (!req.query.has('query')) {
      return ctx.fetch(req)
    }
    const query = req.query.get('query')

    let matchingBooks
    if (query) {
      matchingBooks = booksDB.query(query)
    } else {
      // return a random assortment of 10 books not already in the user's list
      matchingBooks = getBooksNotInUsersList(getUser(req).id).slice(0, 10)
    }

    await sleep()

    return res(ctx.json({books: matchingBooks}))
  }),

  rest.get(`${apiUrl}/books/:bookId`, async (req, res, ctx) => {
    const {bookId} = req.params
    const book = booksDB.read(bookId)
    await sleep()
    if (!book) {
      return res(ctx.status(404), ctx.json({message: 'Book not found'}))
    }
    return res(ctx.json({book}))
  }),

  rest.get(`${apiUrl}/list-items`, async (req, res, ctx) => {
    const user = getUser(req)
    const lis = listItemsDB.readByOwner(user.id)
    const listItemsAndBooks = lis.map(listItem => ({
      ...listItem,
      book: booksDB.read(listItem.bookId),
    }))
    await sleep()
    return res(ctx.json({listItems: listItemsAndBooks}))
  }),

  rest.post(`${apiUrl}/list-items`, async (req, res, ctx) => {
    const user = getUser(req)
    const {bookId} = req.body
    const book = booksDB.read(bookId)
    if (!book) {
      throw new Error(`No book found with the ID of ${bookId}`)
    }
    const listItem = listItemsDB.create({ownerId: user.id, bookId: bookId})
    await sleep()
    return res(ctx.json({listItem: {...listItem, book}}))
  }),

  rest.put(`${apiUrl}/list-items/:listItemId`, async (req, res, ctx) => {
    const user = getUser(req)
    const {listItemId} = req.params
    const updates = req.body
    try {
      listItemsDB.authorize(user.id, listItemId)
    } catch (error) {
      return res(ctx.status(401), ctx.json({message: error.message}))
    }
    const updatedListItem = listItemsDB.update(listItemId, updates)
    await sleep()
    return res(ctx.json({listItem: updatedListItem}))
  }),

  rest.delete(`${apiUrl}/list-items/:listItemId`, async (req, res, ctx) => {
    const user = getUser(req)
    const {listItemId} = req.params
    listItemsDB.authorize(user.id, listItemId)
    listItemsDB.remove(listItemId)
    await sleep()
    return res(ctx.json({success: true}))
  }),
]

function getUser(req) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    throw new Error('A token must be provided')
  }
  let userId
  try {
    userId = atob(token)
  } catch (error) {
    throw new Error('Invalid token. Please login again.')
  }
  return usersDB.read(userId)
}

function getBooksNotInUsersList(userId) {
  const bookIdsInUsersList = listItemsDB
    .readByOwner(userId)
    .map(li => li.bookId)
  return booksDB.readManyNotInList(bookIdsInUsersList)
}

export {handlers}
