# Routing

## Background

The URL is arguably one of the best features of the web. The ability for one
user to share a link to another user who can use it to go directly to a piece of
content on a given website is fantastic. Other platforms don't really have this.

The de-facto standard library for routing React applications is
[React Router](https://reacttraining.com/react-router). It's terrific.

📜 **NOTE: We're using version 6 of the router which should be released soon.**

Most of the docs still apply:

https://reacttraining.com/react-router/web/guides/quick-start

but there are some differences, so as you're looking around at documentation,
reference this first:

https://github.com/ReactTraining/react-router/blob/v6.0.0-alpha.2/docs/installation/getting-started.md
https://github.com/ReactTraining/react-router/tree/v6.0.0-alpha.2/docs

The idea behind routing on the web is you have some API that informs you of
changes to the URL, then you react (no pun intended) to those changes by
rendering the correct user interface based on that URL route. In addition, you
can change the URL when the user performs an action (like clicking a link or
submitting a form). This all happens client-side and does not reload the
browser.

Here's a quick demo of a few of the features you'll need to know about for this
exercise:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

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
        <Rout path="*" element={<YouLost />} />
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
https://tylermcginnis.com/build-your-own-react-router-v4/

## Exercise

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

- `./src/app.js`
- `./src/authenticated-app.js`
- `./src/components/book-row.js`
- `./src/screens/not-found.js`
- `./src/screens/book.js`

## Extra Credit

### 💯 add a RedirectHome Route

We don't have anything to show at the home route `/`. We should redirect the
user from that route to `/discover` automatically. This will involve adding a
route with the path set to `"/"` and redirecting in the component at that path.

> NOTE: I couldn't get the `<Redirect />` component to work, so in my
> implementation I'm using `useNavigate` in a custom component and navigating in
> a `React.useEffect` instead. But if you can make `<Redirect />` work then
> that's great!

### 💯 add `useMatch` to highlight the active nav item

This isn't quite as useful right now, but when we've got several other links in
the nav, it will be helpful to orient users if we have some indication as to
which link the use is currently viewing. Our designer has given us this CSS you
can use:

```javascript
{
  borderLeft: `5px solid ${colors.indigo}`,
  background: colors.gray10,
  ':hover': {
    background: colors.gray10,
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

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps%20%F0%9F%93%98&e=05%3A%20Routing&em=
