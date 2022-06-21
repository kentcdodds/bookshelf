# Make HTTP Requests

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

Our app wouldn't be very interesting without the ability to request data from a
backend for the user to view and interact with. The way to do this in the web is
using HTTP with the `window.fetch` API. Here's a quick simple example of that
API in action:

```javascript
window
  .fetch('http://example.com/movies.json')
  .then(response => {
    return response.json()
  })
  .then(data => {
    console.log(data)
  })
```

All the HTTP methods are supported as well, for example, here's how you would
POST data:

```javascript
window
  .fetch('http://example.com/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // if auth is required. Each API may be different, but
      // the Authorization header with a token is common.
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // body data type must match "content-type" header
  })
  .then(response => {
    return response.json()
  })
  .then(data => {
    console.log(data)
  })
```

If the request fails with an unsuccessful status code (`>= 400`), then the
`response` object's `ok` property will be false. It's common to reject the
promise in this case:

```javascript
window.fetch(url).then(async response => {
  const data = await response.json()
  if (response.ok) {
    return data
  } else {
    return Promise.reject(data)
  }
})
```

It's good practice to wrap `window.fetch` in your own function so you can set
defaults (especially handy for authentication). Additionally, it's common to
have "clients" which build upon this wrapper for operations on different
resources.

Integrating this kind of thing with React involves utilizing React's `useEffect`
hook for making the request and `useState` for managing the status of the
request as well as the response data and error information.

You might consider making the network request in the event handler. In general I
recommend to do all your side effects inside the `useEffect`. This is because in
the event handler you don't have any possibility to prevent race conditions, or
to implement any cancellation mechanism.

📜 https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

## Exercise

Production deploys:

- [Exercise](https://exercises-03-data-fetching.bookshelf.lol/exercise)
- [Final](https://exercises-03-data-fetching.bookshelf.lol/)

👨‍💼 Our users are getting restless and want to start looking at some books, so
we're putting our login flow to the side for a moment so we can work on the book
search feature. The backend is ready to go for this and we've already set up an
environment variable which we can use in our code for the API url (you can see
that in `.env` and `.env.development`). The URL for the search API is:

```javascript
const endpoint = `${process.env.REACT_APP_API_URL}/books?query=Voice%20of%20War`
```

Making a request to this endpoint will return this data:

```json
{
  "books": [
    {
      "title": "Voice of War",
      "author": "Zack Argyle",
      "coverImageUrl": "https://images-na.ssl-images-amazon.com/images/I/41JodZ5Vl%2BL.jpg",
      "id": "B084F96GFZ",
      "pageCount": 372,
      "publisher": "Self Published",
      "synopsis": "..."
    }
  ]
}
```

We've also already designed the page. All that's left is to wire up our design
with the backend. But we've never made a request to the backend yet so you'll
need to create the API `client` function that we'll use for making all requests
to our API (like searching books). Once that's ready, you can use it in your
component.

### Files

- `src/discover.js`
- `src/utils/api-client.js`

## Extra Credit

### 1. 💯 handle failed requests

[Production deploy](https://exercises-03-data-fetching.bookshelf.lol/extra-1)

Our backend developers try really hard to give you the data you need, but
sometimes things just fail (💰 especially if you send the word "FAIL" as the
query... go ahead, try it).

Add support for showing the user helpful information in the event of a failure.
Our designer gave us this which you can use for the UI:

For the search icon:

```javascript
// get FaTimes from react-icons
<FaTimes aria-label="error" css={{color: colors.danger}} />
```

```javascript
// display this between the search input and the results
{
  isError ? (
    <div css={{color: colors.danger}}>
      <p>There was an error:</p>
      <pre>{error.message}</pre>
    </div>
  ) : null
}
```

💰 I wasn't joking. For some reason every time you send the backend the word
"FAIL" it results in a failure. Our backend devs are completely baffled, but it
sure makes it easier for you to test the error state out!

**Files:**

- `src/utils/api-client.js`
- `src/discover.js`

### 2. 💯 use the useAsync hook

[Production deploy](https://exercises-03-data-fetching.bookshelf.lol/extra-2)

After you finished with everything, one of the other UI devs 🧝‍♀️ was reviewing
your PR and asked why you didn't use the `useAsync` hook she wrote last week.
You respond by palming your face 🤦‍♂️ and go back to the drawing board.

`useAsync` is slightly different from what you've built. Here's an example:

```javascript
import {useAsync} from 'utils/hooks'

const {data, error, run, isLoading, isError, isSuccess} = useAsync()

// in an event handler/effect/wherever
run(doSomethingThatReturnsAPromise())
```

This seems to handle your use case well, so let's swap your custom solution with
your co-worker's `useAsync` hook.

**Files:**

- `src/discover.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=03%3A%20Make%20HTTP%20Requests&em=
