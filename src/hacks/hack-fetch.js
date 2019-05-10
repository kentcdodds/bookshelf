// Please don't actually do this in a real app
// this is here to make it easy for us to simulate making HTTP calls in this
// little app that doesn't actually have any server element.
import qs from 'querystringify'
import matchSorter from 'match-sorter'
import allBooks from './books.json'

const originalFetch = window.fetch

const sleep = (t = Math.random() * 200 + 300) =>
  new Promise(resolve => setTimeout(resolve, t))

const isApi = endpoint => url =>
  url === `${process.env.REACT_APP_API_URL}/${endpoint}`

const fakeResponses = [
  {
    test: url => isApi('login')(url) || isApi('register')(url),
    handler: async (url, config) => {
      await sleep()
      const body = JSON.parse(config.body)
      if (body.password === 'fail') {
        return {
          status: 400,
          json: () =>
            Promise.reject({errors: ['Incorrect username or password']}),
        }
      } else {
        return {
          status: 200,
          json: async () => ({
            token: btoa(body.username),
            username: body.username,
          }),
        }
      }
    },
  },
  {
    test: isApi('me'),
    handler: async (url, config) => {
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
        json: async () => ({
          username: atob(token),
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
      return qs.parse(search).hasOwnProperty('query')
    },
    handler: async (url, config) => {
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
