# Routing

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

The URL is arguably one of the best features of the web. The ability for one
user to share a link to another user who can use it to go directly to a piece of
content on a given website is fantastic. Other platforms don't really have this.

The de-facto standard library for routing React applications is
[React Router](https://reactrouter.com). It's terrific.

The idea behind routing on the web is you have some API that informs you of
changes to the URL, then you react (no pun intended) to those changes by
rendering the correct user interface based on that URL route. In addition, you
can change the URL when the user performs an action (like clicking a link or
submitting a form). This all happens client-side and does not reload the
browser.

Here's a quick demo of a few of the features you'll need to know about for this
exercise:

```javascript
import * as React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from 'react-router-dom'

function Home() {
  return <h2>Home</h2>
}

function About() {
  return <h2>About</h2>
}

function Dog() {
  const params = useParams()
  const {dogId} = params
  return <img src={`/img/dogs/${dogId}`} />
}

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/dog/123">My Favorite Dog</Link>
    </nav>
  )
}

function YouLost() {
  return <div>You lost?</div>
}

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dog/:dogId" element={<Dog />} />
        <Route path="*" element={<YouLost />} />
      </Routes>
    </div>
  )
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  )
}

ReactDOM.render(<AppWithRouter />, document.getElementById('app'))
```

That should be enough to get you going on this exercise.

As a fun exercise in routing on the web, you can read this blog post
demonstrating how you might build your own React Router (version 4):
https://ui.dev/build-your-own-react-router/

## Exercise

Production deploys:

- [Exercise](https://exercises-05-routing.bookshelf.lol/exercise)
- [Final](https://exercises-05-routing.bookshelf.lol/)

👨‍💼 Users want to be able to click on the book in the search results and be taken
to a special page for that book. We want the URL to be `/book/:bookId`. Oh, and
if the user lands on a page that we don't have a route for, then we should show
them a nice message and a link to take them back home.

And we want to have a nav bar on the left. There's really only one link we'll
have in there right now, but we'll put more in there soon.

Here are the URLs we should support:

```
/discover       ->     Discover books screen
/book/:bookId   ->     Book screen
*               ->     Helpful "not found" screen
```

💰 tip: there's no need to render the router around the Unauthenticated App,
just the Authenticated one.

### Files

- `src/app.js`
- `src/authenticated-app.js`
- `src/components/book-row.js`
- `src/screens/not-found.js`
- `src/screens/book.js`

## Extra Credit

### 1. 💯 handle URL redirects

[Production deploy](https://exercises-05-routing.bookshelf.lol/extra-1)

We don't have anything to show at the home route `/`. We should redirect the
user from that route to `/discover` automatically. Often, developers will use
their client-side router to redirect users, but it's not possible for the
browser and search engines to get the proper status codes for redirect (301
or 302) so that's not optimal. The server should be configured to handle those.

There are three environments where we have a server serving our content:

1. Locally during development
2. Locally when running the built code via the `npm run serve` script which uses
   https://npm.im/serve
3. In production with Netlify

So for this extra credit you need to configure each of these to redirect `/` to
`/discover`.

**Local Development**

We need to add redirect functionality to the webpack server that `react-scripts`
is running for us. We can do that with the `./src/setupProxy.js` file. In that
file we export a function that accepts an
[express `app`](https://expressjs.com/) and attaches a `get` to handle requests
sent to a URL matching this regex: `/\/$/` and redirects to `/discover`.

```javascript
function proxy(app) {
  // add the redirect handler here
}

module.exports = proxy
```

📜 Here are some docs that might be helpful to you:

- http://expressjs.com/en/4x/api.html#app.get.method
- http://expressjs.com/en/4x/api.html#res.redirect

**With serve**

The `serve` module can be configured with a `serve.json` file in the directory
you serve. Open `./public/serve.json` and see if you can figure out how to get
that to redirect properly.

To know whether it worked, you'll need to run:

```
npm run build
npm run serve
```

Then open `http://localhost:8811`. It worked if your redirected to
`http://localhost:8811/discover`.

📜 Here are the docs you'll probably want:

- https://github.com/zeit/serve-handler/tree/ce35fcd4e1c67356348f4735eed88fb084af9b43#redirects-array

**In production**

There are a few ways to configure Netlify to do redirects. We'll use the
`_redirects` file. Open `./public/_redirects` and add support for redirecting
`/` to `/discover`.

There's no easy way to test this works, so just compare your solution to the
final file and take my word for it that it works. Or, if you really want to
check it out, you can run `npm run build` and then drag and drop the `build`
directory here: https://app.netlify.com/drop

📜 Here's the docs for Netlify's `_redirects` file:

- https://docs.netlify.com/routing/redirects

> Hint: you need to use the "!" force feature for this.

For more on why we prefer server-side redirects over client-side, read
[Stop using client-side route redirects](https://kentcdodds.com/blog/stop-using-client-side-route-redirects).

**Files:**

- `src/setupProxy.js`
- `public/serve.json`
- `public/_redirects`

### 2. 💯 add `useMatch` to highlight the active nav item

[Production deploy](https://exercises-05-routing.bookshelf.lol/extra-2)

This isn't quite as useful right now, but when we've got several other links in
the nav, it will be helpful to orient users if we have some indication as to
which link the user is currently viewing. Our designer has given us this CSS you
can use:

```javascript
{
  borderLeft: `5px solid ${colors.indigo}`,
  background: colors.gray10,
  ':hover': {
    background: colors.gray20,
  },
}
```

You can determine whether the URL matches a given path via the `useMatch` hook:

```javascript
const matches = useMatch('/some-path')
```

From there, you can conditionally apply the styles.

💰 Tip: the Link component in NavLink already has a CSS prop on it. The easiest
way to add these additional styles is by passing an `array` to the css prop like
so:

```javascript
<div
  css={[
    {
      /* styles 1 */
    },
    {
      /* styles 2 */
    },
  ]}
/>
```

**Files:**

- `src/authenticated-app.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=05%3A%20Routing&em=
