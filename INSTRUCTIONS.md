# Authentication

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

So, every request the client makes must include this token if to make
authenticated requests. This is why it's nice to have a small wrapper around
`window.fetch` so you can automatically include this token in every request
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

It's common to store this token in `localStorage`:

```javascript
const headers = {}
const token = window.localStorage.getItem('token')
if (token) {
  headers.Authorization = `Bearer ${token}`
}
window.fetch('http://example.com/pets', {headers})
```

### Auth in React

In a React application you manage user authenticated state the same way you
manage any state: `useState` + `useEffect` (for making the request). When the
user providers a username and password, you make a request and if the request is
successful, the server will return the token to you which you can store in
`localStorage` for making additional requests. Often, in addition to the token,
the server will also respond with the user's information which you can store in
state and use it to display the user's data.

The easiest way to manage displaying the right content to the user based on
whether they've logged in, is to split your app into two parts: Authenticated,
and Unauthenticated. Then you choose which to render based on whether you have
the user's information.

And when the app loads in the first place, you'll want to check if you have a
token. If you do, then show a loading screen while you request the user's data
before rendering anything else. If you don't have a token, then you know you can
render the login screen right away.

📜 Learn more about this:
https://kentcdodds.com/blog/authentication-in-react-applications

## Exercise

👨‍💼 Our users are excited about the demo, but they really want to start making
their own reading lists out of those books. Our backend engineers have been
working around the clock to get this authentication stuff working for you.
Here's what you need to know about the backend APIs:

1. To login, you need to send a `POST` request to the `login` endpoint with the
   `JSON` body `{username, password}` (that requires that you set the
   `content-type` header to `application/json`). This will respond with a `JSON`
   object that has a user property with a `token` which you should store in
   `localStorage` and the rest of the user's data.
2. To register, you have basically the same thing as login except the endpoint
   is `register`.
3. Once you have the token, you can make authenticated requests. You can do this
   by attaching an `Authorization` header to the request with `Bearer {token}`

As for the UI, when the user registers or logs in, they should be shown the
discover page. They should also have a button to logout which will clear the
user's token from the browser and render the home page again.

### Files

- `src/utils/api-client.js`
- `src/utils/auth-client.js`
- `src/app.js`

## Extra Credit

### 1. 💯 Load the user's data on page load

👨‍💼 People are complaining that when they refresh the app shows them the login
screen again. Whoops! Looks like we'll need to check if there's a token in
localStorage and make a request to get the user's info if there is.

Luckily, the backend devs gave us an API we can use to get the user's
information by providing the token:

```javascript
client('me').then(data => {
  console.log(data.user)
})
```

Add a `getUser` function to the `./src/utils/api-client.js` module that checks
if there's a token in localStorage. If there is, then make a request to get the
user's info from the `me` endpoint. Otherwise, return `Promise.resolve(null)`.

Then in your `./src/app.js` module, add a `React.useEffect()` callback to make a
call to `getUser` and then set the user state.

**Files:**

- `src/utils/auth-client.js`
- `src/app.js`

### 2. 💯 Use `useAsync`

Your co-worker came over 🧝‍♀️ because she noticed the app renders the login screen
for a bit while it's requesting the user's information. She then politely
reminded you that you could get loading state and everything for free by using
her `useAsync` hook. Doh! Let's update `./src/app.js` to use `useAsync` and
solve this loading state issue.

She mentions you'll need to know that you can set the data directly:

```javascript
const {data, error, isLoading, isSuccess, isError} = useAsync()

const doSomething = () => somethingAsync().then(data => setData(data))
```

You'll use this for the `login` and `register`.

When in `isLoading` and `isPending` state, you can render the `FullPageSpinner`
from `components/lib`. If you end up in `isError` state then you can render
this:

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

If the user's token expires or the user does something they're not supposed to,
the backend can send a 401 request. If that happens, then we'll want to log the
user out and refresh the page automatically so all data is removed from the
page.

💰 You'll want to move the `logout` function from `auth-client` to `api-client`
to make this work nicely.

**Files:**

- `src/utils/auth-client.js`
- `src/utils/api-client.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps%20%F0%9F%93%98&e=04%3A%20Authentication&em=
