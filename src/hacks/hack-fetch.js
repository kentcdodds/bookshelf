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
      const token = config.headers.Authorization.replace('Bearer ', '')
      if (!token) {
        return {
          status: 401,
          json: () => Promise.reject({errors: ['A token must be provided']}),
        }
      }
      return {
        status: 200,
        json: async () => users.read(atob(token)),
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
  // fallback to originalFetch
  {
    test: () => true,
    handler: (...args) => originalFetch(...args),
  },
]

window.fetch = (...args) => {
  const {handler} = fakeResponses.find(({test}) => {
    try {
      return test(...args)
    } catch (error) {
      // ignore the error and hope everything's ok...
      return false
    }
  })
  return handler(...args)
}
