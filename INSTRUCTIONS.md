# Unit Testing

## Background

In every application, you'll have functions that you find yourself using
throughout the application. These types of functions are perfect for unit
testing. Whether it's a function to format a user object to their display name,
or a utility to compute the scroll position of an element in a list, extracting
this complex logic to a utility function and testing it in isolation can be
really helpful.

But it's not just "pure functions" that can benefit from unit testing. Any code
that's heavily relied upon is a good candidate for unit testing. Keep in mind
that not everything needs a unit test. Most of your code can be covered by good
component/integration tests. Rather than thinking about getting all your code
covered by unit tests, think about
[covering your use cases](https://kentcdodds.com/blog/how-to-know-what-to-test).

## Exercise

Production deploys:

- [Exercise](https://exercises-11-unit-tests.bookshelf.lol/exercise)
- [Final](https://exercises-11-unit-tests.bookshelf.lol/)

In this exercise, we've got two utilities that we're going to unit test. The
first is a very simple `formatDate` function, and the other is the API `client`
function.

The `formatDate` function (part of the `src/utils/misc.js` module) is a pure
function and doesn't have much logic to it, start with that one to get warmed
up.

The `client` function is a bit more complicated because it makes an HTTP request
with `window.fetch` which we don't want to actually perform in our tests. So
we're going to use a module called `msw`

### Files

- `src/utils/__tests__/misc.js`
- `src/utils/__tests__/api-client.js`

## Extra Credit

### 1. 💯 Stop mocking fetch

[Production deploy](https://exercises-11-unit-tests.bookshelf.lol/extra-1)

You may feel a little uncomfortable with the idea of mocking out `window.fetch`
the way we're doing in that test. In larger applications there could be a LOT of
requests that your components make, or maybe you're using GraphQL and mocking
out fetch like this is not feasible.

The fact is, we've decided to not make real requests because that requires
significantly more setup and makes our tests take a lot longer. However, we
can't get around telling our app the response to the requests that it's going to
be making. We can, however, make it a lot easier to write these mock request
handlers and we're going to use [`msw`](https://github.com/mswjs/msw) to do it.

Let's take a step back. When you're developing your application, you've probably
got a backend server you're interacting with. That backend serves (among other
things) as the intermediary between the client that you're writing and the
database and other services your application is using. Maybe you're working on
both the frontend and the backend. Maybe you're on the same team as the backend
devs. Maybe you're on completely different teams. Maybe you're using services
and you're backend devs are at a completely different company.

In any case, it's quite possible that you could be working on features in the
frontend that don't have a backend ready. Or maybe you want to load your
components up in an isolated environment during development (like
[Storybook](https://storybook.js.org/)). Or perhaps you'd like to be able to
continue development of the frontend without a connection to a remote service.
Or maybe the remote service is slower than you like. For a myriad of reasons,
you may find it preferable to not hit the _actual_ backend during development.

This is the problem that [msw](https://github.com/mswjs/msw) was built to solve.
It allows you to create request handlers (regular HTTP calls as well as GraphQL
queries) and return mock responses. It does this using a ServiceWorker, so
you'll see the fetch requests in the network tab, but as long as you have a mock
handler, a real fetch call will not be made and instead your request handler can
handle the request for you.

The bookshelf app you've been working on is using this mechanism right now. It's
implemented a "database" (which is really just `localStorage`) and when you make
network requests, a client-side request handler is called which interacts
directly with that database layer. In production, you can swap `msw` with a real
production server (after running your true E2E tests to make sure things are
good to go) and you've got yourself a great development experience.

> 💰 If you'd like to check out how all of this works, start in
> `src/test/server`

So, bringing this back to testing, because we've essentially re-implemented the
basics of our backend with msw handlers, we can use those _exact same_ handlers
for our tests as well using `msw`'s `setupServer` function:

```javascript
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'

const mockServer = setupServer(...handlers)
mockServer.listen()
// ready to start accepting requests
// and when you're done, call `mockServer.close()`
```

That's already handled for you in `src/test/server/test-server.js`. So all you
need to do is import the `server` from `test/server` and you'll be able to start
it up and stop it. You'll want to do the `listen` in a `beforeAll` and the
`close` in an `afterAll`.

We do have the entire API implemented as msw server handlers, but for these
tests, we're not hitting real endpoints, so we need to add one-off server
handlers for those. Luckily for us, `msw` has the ability to add server handlers
after the server has started and reset them between tests to preserve test
isolation. Here's an example of adding a server handler inside your test:

```javascript
test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(endpoint)

  expect(result).toEqual(mockResult)
})
```

Want to make assertions on the request that was made? Try this:

```javascript
let request
server.use(
  rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
    request = req
    return res(ctx.json(mockResult))
  }),
)
await client(endpoint)
// assert on request
```

To keep your tests isolated, you'll want to remove those extra server handlers.
Do this with `afterEach(() => server.resetHandlers())`

Learn more about this from
[Stop Mocking Fetch](https://kentcdodds.com/blog/stop-mocking-fetch)

So for this extra credit, replace all your `fetch` references, get the server
started, and add runtime handlers.

### 2. 💯 Test failure cases

[Production deploy](https://exercises-11-unit-tests.bookshelf.lol/extra-2)

There are two use cases that our `client` supports that we should probably cover
in our tests:

1. If the `response.ok` is `false`, the promise is rejected with the data
   returned from the server.
2. If the `response.status` is `401` (Unauthorized), we log the user out and
   clear the cache and localStorage.

For this extra credit, you'll need to write tests for both of those cases. The
first one should be more straightforward. The second one will be a bit more
tricky because you'll want to assert that `queryCache.clear` was called.

> 💰 use `jest.mock` to mock the `react-query` module.

**Files:**

- `src/utils/__tests__/api-client.js`

### 3. 💯 Use `setupTests.js`

[Production deploy](https://exercises-11-unit-tests.bookshelf.lol/extra-3)

Most of our tests are going to need the `window.fetch` to be mockable, and we
probably want to clear out _all_ of `localStorage` between _every_ test rather
than just the `token` key between tests in our `api-client.js` test.

Luckily for us, we already have jest configured to automatically require the
file `src/setupTests.js`. (Check the `jest.config.js` file and look at the
`setupFilesAfterEnv` config). So all we need to do now is move that setup from
the `src/utils/__tests__/api-client.js` to the `src/setupTests.js` file and then
all of our tests will benefit from the same setup automatically.

> 💰 you can clear _all_ of local storage with `window.localStorage.clear()`

**Files:**

- `src/utils/__tests__/api-client.js`
- `src/setupTests.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=11%3A%20Unit%20Testing&em=
