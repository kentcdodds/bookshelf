# Context

## Background

Once we've got all our server cache state inside `react-query`, there's not a
whole lot of global state left in our application that can't be easily managed
via a combination of React state, composition, and lifting state.

That said, there are definitely still scenarios where having some UI state
that's globally available through context would be valuable. Things like
application "toast" notifications, user authentication state, or modal and focus
management can all benefit from the coordination and freedom from
[Prop Drilling](https://kentcdodds.com/blog/prop-drilling) that a single global
provider could provide.

📜 For a refresher on the APIs we'll be using:

- https://reactjs.org/docs/hooks-reference.html#usecontext

## Exercise

Production deploys:

- [Exercise](https://exercises-07-context.bookshelf.lol/exercise)
- [Final](https://exercises-07-context.bookshelf.lol/)

In this exercise, rather than passing the `user` object and the `login`,
`register`, and `logout` functions as props to the `AuthenticatedApp` and the
`UnauthenticatedApp`, we're going to put those values in an
`AuthContext.Provider` value and then those components will get the things they
need from context.

### Files

- `src/context/auth-context.js`
- `src/app.js`
- `src/utils/list-items.js`
- `src/utils/books.js`
- `src/components/list-item-list.js`
- `src/components/status-buttons.js`
- `src/components/rating.js`
- `src/components/book-row.js`
- `src/screens/reading-list.js`
- `src/screens/finished.js`
- `src/screens/book.js`
- `src/screens/discover.js`
- `src/authenticated-app.js`
- `src/unauthenticated-app.js`

## Extra Credit

### 1. 💯 create a `useAuth` hook

[Production deploy](https://exercises-07-context.bookshelf.lol/extra-1)

It's annoying to have to pass the `AuthContext` around to `React.useContext` and
if someone were to accidentally use `React.useContext(AuthContext)` without
rendering `AuthContext.Provider`, they would get a pretty unhelpful error
message about not being able to destructure `undefined`.

Create a `useAuth` custom hook that consumes the `AuthContext` from
`React.useContext`. This can be as simple as
`const useAuth = () => React.useContext(AuthContext)` but if you want to add a
little extra protection to ensure people only use it within a provider then you
can do that.

**Files:**

- `src/context/auth-context.js`
- `src/authenticated-app.js`
- `src/unauthenticated-app.js`
- `src/utils/books.js`
- `src/utils/list-items.js`

### 2. 💯 create an `AuthProvider` component

[Production deploy](https://exercises-07-context.bookshelf.lol/extra-2)

Rendering providers in regular application code is fine, but one nice way to
create a logical separation of concerns (which will help with maintainability)
is to create a component who's sole purpose is to manage and provide the
authentication state. So for this extra credit, you need to create an
`AuthProvider` component. Most of the code for this component will be moved from
the `src/app.js` module and you'll move it to the `src/context/auth-context.js`
module.

In that module, create an `AuthProvider` component that renders the
`AuthContext.Provider` Copy most of the code from the `App` component in the
`src/app.js` module and make sure that the `value` you pass to the provider is:
`{user, login, register, logout}`

Don't forget to export the `AuthProvider` component along with the `useAuth`
hook. And you don't need to export the `AuthContext` anymore!

**Files:**

- `src/context/auth-context.js`
- `src/app.js`
- `src/index.js` (this is where you'll render the `AuthProvider`)
- `src/authenticated-app.js`
- `src/unauthenticated-app.js`

### 3. 💯 colocate global providers

[Production deploy](https://exercises-07-context.bookshelf.lol/extra-3)

Typically in applications, you'll have several context providers that are global
or near-global. Most of the time, it's harmless to just make them all global and
create a single provider component that brings them all together. In addition to
general "cleanup", this can help make testing easier.

Inside the `src/context/index.js` module create an `AppProviders` component
that:

- accepts a `children` prop
- renders all the context providers for our app:
  - `ReactQueryConfigProvider` <-- get that from the `src/index.js` module
  - `Router` <-- get that from the `src/app.js` module
  - `AuthProvider` <-- you should have created that in
    `src/context/auth-context.js`
- Pass the children along to the last provider

💰 Here's how it'll look:

```javascript
function AppProviders({children}) {
  return (
    <Provider1>
      <Provider2>
        <Provider3>{children}</Provider3>
      </Provider2>
    </Provider1>
  )
}
```

Don't forget to `export {AppProviders}`

**Files:**

- `src/index.js`
- `src/context/index.js`
- `src/app.js`

### 4. 💯 create a `useClient` hook

[Production deploy](https://exercises-07-context.bookshelf.lol/extra-4)

There's a bit of duplication in our custom react-query hooks. Each one has to
get the user, and then they use the user to get the token which they then pass
to the client. But I think it would be better to have a hook that gives us an
authenticated client instead. So basically, a hook that gives us a memoized
version of:

```javascript
// token comes from useAuth().user.token
function authenticatedClient(endpoint, config) {
  return client(endpoint, {...config, token})
}
```

So create a `useClient` hook, and then use it wherever code attempts to make
authenticated client calls.

**Files:**

- `src/context/auth-context.js`
- `src/utils/list-items.js`
- `src/utils/books.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=07%3A%20Context&em=
