// Please don't actually do this in a real app
// this is here to make it easy for us to simulate making HTTP calls in this
// little app that doesn't actually have any server element.
import qs from 'querystringify'
import matchSorter from 'match-sorter'
import allBooks from './data/books.json'
import * as users from './data/users'
import * as listItems from './data/list-items'

const originalFetch = window.fetch

const sleep = (t = Math.random() * 200 + 300) =>
  new Promise(resolve => setTimeout(resolve, t))

const apiUrl = new window.URL(process.env.REACT_APP_API_URL)
const isApi = (endpoint, method = 'GET', queryParam) => (url, config) => {
  const {origin, pathname, search} = new window.URL(url)
  return (
    origin === apiUrl.origin &&
    pathname.startsWith(`${apiUrl.pathname}/${endpoint}`) &&
    config.method === method &&
    (queryParam ? qs.parse(search).hasOwnProperty(queryParam) : true)
  )
}

const fakeResponses = [
  {
    test: isApi('login', 'POST'),
    async handler(url, config) {
      await sleep()
      const body = JSON.parse(config.body)
      const user = users.authenticate({
        username: body.username,
        password: body.password,
      })
      return {
        status: 200,
        json: async () => ({user}),
      }
    },
  },
  {
    test: isApi('register', 'POST'),
    async handler(url, config) {
      await sleep()
      const {username, password} = JSON.parse(config.body)
      if (!username) {
        throw new Error('A username is required')
      }
      if (!password) {
        throw new Error('A password is required')
      }
      const userFields = {username, password}
      users.create(userFields)
      const user = users.authenticate(userFields)
      return {
        status: 200,
        json: async () => ({user}),
      }
    },
  },
  {
    description: 'get the current user',
    test: isApi('me'),
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      return {
        status: 200,
        json: async () => ({user}),
      }
    },
  },
  {
    description: 'search books',
    test: isApi('book', 'GET', 'query'),
    async handler(url, config) {
      const {query} = qs.parse(new window.URL(url).search)
      const matchingBooks = matchSorter(allBooks, query, {
        keys: [
          'title',
          'author',
          'publisher',
          {threshold: matchSorter.rankings.CONTAINS, key: 'synopsis'},
        ],
      })
      return {
        status: 200,
        json: async () => ({
          books: matchingBooks,
        }),
      }
    },
  },
  {
    description: 'get books by their id',
    test: isApi('book', 'GET', 'bookIds'),
    async handler(url, config) {
      const {bookIds} = qs.parse(new window.URL(url).search)
      const books = allBooks.filter(book => bookIds.includes(book.id))
      return {
        status: 200,
        json: async () => ({books}),
      }
    },
  },
  {
    description: 'get list items and their book by their id',
    test: isApi('list-item', 'GET', 'listItemIds'),
    async handler(url, config) {
      const {listItemIds} = qs.parse(new window.URL(url).search)
      const idsToRead = decodeURIComponent(listItemIds).split(',')
      const user = getUser(config)
      const lis = listItems.readMany(user.id, idsToRead)
      const listItemsAndBooks = lis.map(listItem => ({
        ...listItem,
        book: allBooks.find(book => book.id === listItem.bookId),
      }))
      return {
        status: 200,
        json: async () => ({listItems: listItemsAndBooks}),
      }
    },
  },
  {
    description: 'get list items and their book by their ownerId',
    test: isApi('list-item', 'GET', 'ownerId'),
    async handler(url, config) {
      const ownerId = decodeURIComponent(
        qs.parse(new window.URL(url).search).ownerId,
      )
      const user = getUser(config)
      if (user.id !== ownerId) {
        throw new Error(
          `User ${
            user.id
          } is not authorized to load list items for user ${ownerId}`,
        )
      }
      const lis = listItems.readByOwner(user.id)
      const listItemsAndBooks = lis.map(listItem => ({
        ...listItem,
        book: allBooks.find(book => book.id === listItem.bookId),
      }))
      return {
        status: 200,
        json: async () => ({listItems: listItemsAndBooks}),
      }
    },
  },
  {
    description: 'create a list item',
    test: isApi('list-item', 'POST'),
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      const {bookId} = JSON.parse(config.body)
      const book = allBooks.find(book => book.id === bookId)
      if (!book) {
        throw new Error(`No book found with the ID of ${bookId}`)
      }
      const listItem = listItems.create({ownerId: user.id, bookId: bookId})
      return {
        status: 200,
        json: async () => ({listItem}),
      }
    },
  },
  {
    description: 'update a list item',
    test: isApi('list-item', 'PUT'),
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      const listItemId = getSubjectId(url)
      const updates = JSON.parse(config.body)
      listItems.authorize(user.id, listItemId)
      const updatedListItem = listItems.update(listItemId, updates)
      return {
        status: 200,
        json: async () => ({listItem: updatedListItem}),
      }
    },
  },
  {
    description: 'delete a list item',
    test: isApi('list-item', 'DELETE'),
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      const listItemId = getSubjectId(url)
      listItems.authorize(user.id, listItemId)
      listItems.remove(listItemId)
      return {
        status: 200,
        json: async () => ({success: true}),
      }
    },
  },
  // fallback to originalFetch
  {
    test: () => true,
    handler: (...args) => originalFetch(...args),
  },
]

function getSubjectId(url) {
  const {pathname} = new URL(url)
  return pathname
    .split('/')
    .filter(Boolean)
    .slice(-1)[0]
}

function getUser(config) {
  const token = config.headers.Authorization.replace('Bearer ', '')
  if (!token) {
    throw new Error('A token must be provided')
  }
  return users.read(atob(token))
}

window.fetch = async (...args) => {
  const {handler} = fakeResponses.find(({test}) => {
    try {
      return test(...args)
    } catch (error) {
      // ignore the error and hope everything's ok...
      return false
    }
  })
  try {
    const response = await handler(...args)
    return response
  } catch (error) {
    if (error instanceof Error) {
      return Promise.reject({
        status: 500,
        message: error.message,
      })
    }
    return Promise.reject(error)
  }
}
