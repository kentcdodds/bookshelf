// 🐨 grab the client and localStorageKey, you'll need these
// import {client} from '../api-client'

// 💰 you'll need this to be able to assert that window.fetch is called properly
// const url = endpoint => `${process.env.REACT_APP_API_URL}/${endpoint}`

// Each of the tests will be calling window.fetch, but we don't want to
// make real fetch requests
// 🐨 add a beforeEach here to turn window.fetch into a mock function
// 📜 https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname
// 🐨 add an afterEach to restore window.fetch to it's original implementation
// 📜 https://jestjs.io/docs/en/mock-function-api#mockfnmockrestore

// 🐨 flesh these out:

test.todo('calls fetch at the endpoint with the arguments for GET requests')
// 🐨 use mockResolvedValueOnce to mock what window.fetch resolves to
// which should be something that resembles what window.fetch typically resolves
// to. You can determine this by logging the response value and running the app.
// 💰 or, if you'd like help with this, scroll to the bottom for the spoiler.
// 🐨 call the client (don't forget that it's asynchronous)
// 🐨 verify that the resolved value is correct
// 🐨 verify that window.fetch was called correctly

test.todo('adds auth token when a token is provided')
// 🐨 mock the resolved value of window.fetch
// 🐨 call the client with a fake token (it's async)
// 🐨 verify that window.fetch was called correctly (it should include the Authorization header)

test.todo('allows for config overrides')
// 🐨 mock the resolved value of window.fetch
// 🐨 create a custom config that specifies any properties you like (like `mode: "cors"`, and including a custom header)
// 🐨 verify that window.fetch was called correctly

test.todo(
  'when data is provided, it is stringified and the method defaults to POST',
)
// 🐨 create a mock data object
// 🐨 mock the resolved value of window.fetch
// 🐨 call client with an endpoint and an object with the data
// 🐨 verify that window.fetch was called correctly

/*




























💰 spoilers below...






















































const defaultResult = {mockValue: 'VALUE'}
const defaultResponse = {
  ok: true,
  json: () => Promise.resolve(defaultResult),
}
window.fetch.mockResolvedValueOnce(defaultResponse)

*/
