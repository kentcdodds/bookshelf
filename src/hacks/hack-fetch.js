// Please don't actually do this in a real app
// this is here to make it easy for us to simulate making HTTP calls in this
// little app that doesn't actually have any server element.
import qs from 'querystringify'
import matchSorter from 'match-sorter'
import allBooks from './data/books.json'
import * as users from './data/users'

const originalFetch = window.fetch

const sleep = (t = Math.random() * 200 + 300) =>
  new Promise(resolve => setTimeout(resolve, t))

const isApi = endpoint => url =>
  url === `${process.env.REACT_APP_API_URL}/${endpoint}`

const fakeResponses = [
  {
    test: isApi('login'),
    async handler(url, config) {
      await sleep()
      const body = JSON.parse(config.body)
      return {
        status: 200,
        json: async () =>
          users.authenticate({
            username: body.username,
            password: body.password,
          }),
      }
    },
  },
  {
    test: isApi('register'),
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
      return {
        status: 200,
        json: async () => users.authenticate(userFields),
      }
    },
  },
  {
    test: isApi('me'),
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      return {
        status: 200,
        json: async () => user,
      }
    },
  },
  {
    test: url => {
      if (!url.startsWith(`${process.env.REACT_APP_API_URL}/books`)) {
        return
      }
      const {search} = new window.URL(url)
      return qs.parse(search).hasOwnProperty('query')
    },
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
    test: url => {
      if (!url.startsWith(`${process.env.REACT_APP_API_URL}/books`)) {
        return
      }
      const {search} = new window.URL(url)
      return qs.parse(search).hasOwnProperty('bookIds')
    },
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
    test: (url, config) =>
      isApi('user/reading-list')(url) && config.method === 'PUT',
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      const {bookId} = JSON.parse(config.body)
      const book = allBooks.find(book => book.id === bookId)
      if (!book) {
        throw new Error(`No book found with the ID of ${bookId}`)
      }
      const uniqueList = new Set(user.readingList)
      uniqueList.add(bookId)
      const updatedUser = users.update(user.id, {
        readingList: Array.from(uniqueList),
      })
      return {
        status: 200,
        json: async () => updatedUser,
      }
    },
  },
  {
    test: (url, config) =>
      url.startsWith(`${process.env.REACT_APP_API_URL}/user/reading-list/`) &&
      config.method === 'DELETE',
    async handler(url, config) {
      await sleep()
      const user = getUser(config)
      const bookId = url.split(
        `${process.env.REACT_APP_API_URL}/user/reading-list/`,
      )[1]
      const book = allBooks.find(book => book.id === bookId)
      if (!book) {
        throw new Error(`No book found with the ID of ${bookId}`)
      }
      const updatedUser = users.update(user.id, {
        readingList: user.readingList.filter(id => id !== bookId),
      })
      return {
        status: 200,
        json: async () => updatedUser,
      }
    },
  },
  // fallback to originalFetch
  {
    test: () => true,
    handler: (...args) => originalFetch(...args),
  },
]

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
