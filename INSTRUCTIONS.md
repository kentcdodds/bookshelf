# Authentication

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

### Authenticated HTTP requests

Applications without user authentication cannot reliably store and present data
tied to a specific user. And users expect the ability to save data, close the
app, and return to the app and interact with the same data they created. To do
this securely (in a way that doesn't allow anyone to access anyone else's data),
you need to support authentication. The most common approach to this is a
username/password pair.

However, the user doesn't want to submit their password every time they need to
make a request for data. They want to be able to log into the application and
then the application can continuously authenticate requests for them
automatically. That said, we don't want to store the user's password and send
that with every request. A common solution to this problem is to use a special
limited use "token" which represents the user's current session. That way the
token can be invalidated (in the case that it's lost or stolen) and the user
doesn't have to change their password. They simply re-authenticate and they can
get a fresh token.

So, every request the client makes must include this token to make authenticated
requests. This is one reason it's so nice to have a small wrapper around
`window.fetch`: so you can automatically include this token in every request
that's made. A common way to attach the token is to use a special request header
called "Authorization".

Here's an example of how to make an authenticated request:

```javascript
window.fetch('http://example.com/pets', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

That token can really be anything that uniquely identifies the user, but a
common standard is to use a JSON Web Token (JWT). 📜 https://jwt.io

Authentication and user identity management is a difficult problem, so it's
recommended to use a service to handle this for you. Most services will give you
a mechanism for retrieving a token when the user opens your application and you
can use that token to make authenticated requests to your backend. Some services
you might consider investigating are [Auth0](https://auth0.com/),
[Netlify Identity](https://docs.netlify.com/visitor-access/identity/#enable-identity-in-the-ui),
and [Firebase Authentication](https://firebase.google.com/products/auth).

Regardless of what service provider you use (or if you build your own), the
things you'll learn in this exercise are the same:

1. Call some API to retrieve a token
2. If there's a token, then send it along with the requests you make

```javascript
const token = await authProvider.getToken()
const headers = {
  Authorization: token ? `Bearer ${token}` : undefined,
}
window.fetch('http://example.com/pets', {headers})
```

### Auth in React

In a React application you manage user authenticated state the same way you
manage any state: `useState` + `useEffect` (for making the request). When the
user provides a username and password, you make a request and if the request is
successful, you can then use that token to make additional authenticated
requests. Often, in addition to the token, the server will also respond with the
user's information which you can store in state and use it to display the user's
data.

The easiest way to manage displaying the right content to the user based on
whether they've logged in, is to split your app into two parts: Authenticated,
and Unauthenticated. Then you choose which to render based on whether you have
the user's information.

And when the app loads in the first place, you'll call your auth provider's API
to retrieve a token if the user is already logged in. If they are, then you can
show a loading screen while you request the user's data before rendering
anything else. If they aren't, then you know you can render the login screen
right away.

📜 Learn more about this:
https://kentcdodds.com/blog/authentication-in-react-applications

## Exercise

Production deploys:

- [Exercise](https://exercises-04-authentication.bookshelf.lol/exercise)
- [Final](https://exercises-04-authentication.bookshelf.lol/)

👨‍💼 Our users are excited about the demo, but they really want to start making
their own reading lists out of those books. Our backend engineers have been
working around the clock to get this authentication stuff working for you.

We're using a service called "Auth Provider" (yes, a very clever name, it's a
made-up thing, but should give you a good idea of how to use any typical
authentication provider which is the point).

Here's what you need to know about "Auth Provider":

- You import it like this: `import * as auth from 'auth-provider'`
- Here are the exports you'll need (they're all `async`):
  - `getToken()` - resolves to the token if it exists
  - `login({username, password})` - resolves to the user if successful
  - `register({username, password})` - resolves to the user if successful
  - `logout` - logs the user out

To make an authenticated request, you'll need to get the token, and attach an
`Authorization` header to the request set to: `Bearer {token}`

As for the UI, when the user registers or logs in, they should be shown the
discover page. They should also have a button to logout which will clear the
user's token from the browser and render the home page again.

### Files

- `src/app.js`

## Extra Credit

### 1. 💯 Load the user's data on page load

[Production deploy](https://exercises-04-authentication.bookshelf.lol/extra-1)

👨‍💼 People are complaining that when they refresh the app shows them the login
screen again. Whoops! Looks like we'll need to check if there's a token in
localStorage and make a request to get the user's info if there is.

Luckily, the backend devs gave us an API we can use to get the user's
information by providing the token:

```javascript
const token = await auth.getToken()
if (token) {
  // we're logged in! Let's go get the user's data:
  client('me', {token}).then(data => {
    console.log(data.user)
  })
} else {
  // we're not logged in. Show the login screen
}
```

Add this capability to `src/app.js` (in a `React.useEffect()`) so users don't
have to re-enter their username and password if the Auth Provider has the token
already.

You'll also need to add the ability to accept the `token` option in the client
and set that in the `Authorization` header (remember, it should be set to:
`Bearer ${token}`)

**Files:**

- `src/app.js`
- `src/utils/api-client.js`

### 2. 💯 Use `useAsync`

[Production deploy](https://exercises-04-authentication.bookshelf.lol/extra-2)

Your co-worker came over 🧝‍♀️ because she noticed the app renders the login screen
for a bit while it's requesting the user's information. She then politely
reminded you that you could get loading state and everything for free by using
her `useAsync` hook. Doh! Let's update `./src/app.js` to use `useAsync` and
solve this loading state issue.

She mentions you'll need to know that you can set the data directly:

```javascript
const {
  data,
  error,
  isIdle,
  isLoading,
  isSuccess,
  isError,
  run,
  setData,
} = useAsync()

const doSomething = () => somethingAsync().then(data => setData(data))
```

You'll use this for the `login` and `register`.

When in `isLoading` or `isIdle` state, you can render the `FullPageSpinner` from
`components/lib`. If you end up in `isError` state then you can render this:

```javascript
<div
  css={{
    color: colors.danger,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <p>Uh oh... There's a problem. Try refreshing the app.</p>
  <pre>{error.message}</pre>
</div>
```

**Files:**

- `src/app.js`

### 3. 💯 automatically logout on 401

[Production deploy](https://exercises-04-authentication.bookshelf.lol/extra-3)

If the user's token expires or the user does something they're not supposed to,
the backend can send a 401 request. If that happens, then we'll want to log the
user out and refresh the page automatically so all data is removed from the
page.

Call `auth.logout()` to delete the user's token from the Auth Provider and call
`window.location.assign(window.location)` to reload the page for them.

**Files:**

- `src/utils/api-client.js`

### 4. 💯 Support posting data

[Production deploy](https://exercises-04-authentication.bookshelf.lol/extra-4)

It won't be long before we need to actually start sending data along with our
requests, so let's enhance the `client` to support that use case as well.

Here's how we should be able to use the `client` when this is all done:

```javascript
client('http://example.com/pets', {
  token: 'THE_USER_TOKEN',
  data: {name: 'Fluffy', type: 'cat'},
})

// results in fetch getting called with:
// url: http://example.com/pets
// config:
//  - method: 'POST'
//  - body: '{"name": "Fluffy", "type": "cat"}'
//  - headers:
//    - 'Content-Type': 'application/json'
//    - Authorization: 'Bearer THE_USER_TOKEN'
```

**Files:**

- `src/utils/api-client.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=04%3A%20Authentication&em=
