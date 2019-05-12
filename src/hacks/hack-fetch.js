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
      await sleep()
      const {query} = qs.parse(new window.URL(url).search)
      let matchingBooks
      if (query) {
        matchingBooks = matchSorter(allBooks, query, {
          keys: [
            'title',
            'author',
            'publisher',
            {threshold: matchSorter.rankings.CONTAINS, key: 'synopsis'},
          ],
        })
      } else {
        // return a random assortment of 10 books
        matchingBooks = shuffle(allBooks).slice(0, 10)
      }
      return {
        status: 200,
        json: async () => ({
          books: matchingBooks,
        }),
      }
    },
  },
  {
    description: `get a book by it's id`,
    test: isApi('book'),
    async handler(url, config) {
      await sleep()
      const bookId = getSubjectId(url)
      const book = allBooks.find(book => book.id === bookId)
      return {
        status: 200,
        json: async () => ({book}),
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
        json: async () => ({listItem: {...listItem, book}}),
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

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

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
  let userId
  try {
    userId = atob(token)
  } catch (error) {
    throw new Error('Invalid token. Please login again.')
  }
  return users.read(userId)
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
  const groupTitle = `%c ${args[1].method} -> ${args[0]}`
  try {
    const response = await handler(...args)
    console.groupCollapsed(groupTitle, 'color: #0f9d58')
    console.info('REQUEST:', {url: args[0], ...args[1]})
    console.info('RESPONSE:', {
      ...response,
      ...(response.json ? {json: await response.json()} : {}),
    })
    console.groupEnd()
    return response
  } catch (error) {
    let rejection = error
    if (error instanceof Error) {
      rejection = {
        status: 500,
        message: error.message,
      }
    }
    console.groupCollapsed(groupTitle, 'color: #ef5350')
    console.info('REQUEST:', {url: args[0], ...args[1]})
    console.info('REJECTION:', rejection)
    console.groupEnd()
    return Promise.reject(rejection)
  }
}
