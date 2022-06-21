# Unit Testing

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

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

- [Exercise](https://exercises-11-unit-testing.bookshelf.lol/exercise)
- [Final](https://exercises-11-unit-testing.bookshelf.lol/)

In this exercise, we've got two utilities that we're going to unit test. The
first is a very simple `formatDate` function, and the other is the API `client`
function.

The `formatDate` function (part of the `src/utils/misc.js` module) is a pure
function and doesn't have much logic to it, start with that one to get warmed
up.

The `client` function is a bit more complicated because it makes an HTTP request
with `window.fetch` which we don't want to actually perform in our tests.
Luckily for us, we already have a mock server for our development using
[`msw`](https://github.com/mswjs/msw), so we can use that same tool to have a
mock server for our tests. This is already set up for you in the
`src/test/server` directory. All you need to do is make sure the server is
started before all the tests and that it's stopped after all the tests.

With `msw` setup, you can now add request handlers to the server before calling
`client`. For example:

```javascript
server.use(
  rest.get(`https://bookshelf.jk/example`, async (req, res, ctx) => {
    return res(ctx.json({some: 'Sweet json!'}))
  }),
)

const response = await window.fetch(`https://bookshelf.jk/example`)
const result = response.json()
result.some === 'Sweet json!' // true
```

This means that we can ensure that the client is interacting with `window.fetch`
correctly because `window.fetch` is actually executed, the request is simply
intercepted by `msw` so we can handle it ourselves rather than relying on a
third party server.

### Files

- `src/utils/__tests__/misc.js`
- `src/utils/__tests__/api-client.js`

## Extra Credit

### 1. 💯 Test failure cases

[Production deploy](https://exercises-11-unit-testing.bookshelf.lol/extra-1)

There are two use cases that our `client` supports that we should probably cover
in our tests:

1. If the `response.ok` is `false`, the promise is rejected with the data
   returned from the server. This happens if the `response.status` is outside of
   the successful range of 200-299 (📜 learn more:
   https://developer.mozilla.org/en-US/docs/Web/API/Response/ok).
2. If the `response.status` is `401` (Unauthorized), we log the user out and
   clear the query cache.

To set the `status` in your `msw` request handler, you can do this:

```javascript
return res(ctx.status(400), ctx.json({message: 'this is the response!'}))
```

For this extra credit, you'll need to write tests for both of those cases. The
first one should be more straightforward. The second one will be a bit more
tricky because you'll want to assert that `queryCache.clear` and `auth.logout`
were both called.

> 💰 use `jest.mock` to mock the `react-query` and `auth-provider` modules.

**Files:**

- `src/utils/__tests__/api-client.js`

### 2. 💯 Use `setupTests.js`

[Production deploy](https://exercises-11-unit-testing.bookshelf.lol/extra-2)

Most of our tests are going to need the server to be running. Luckily for us, we
already have jest configured to automatically require the file
`src/setupTests.js`. (Check the `jest.config.js` file and look at the
`setupFilesAfterEnv` config). So all we need to do now is move that setup from
the `src/utils/__tests__/api-client.js` to the `src/setupTests.js` file and then
all of our tests will benefit from the same setup automatically.

**Files:**

- `src/utils/__tests__/api-client.js`
- `src/setupTests.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=11%3A%20Unit%20Testing&em=
