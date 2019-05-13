# Authentication

## Background

No matter the type of your application, there will probably be some form of
authentication. We're already authenticating to the backend in the app's login
form, but once the user's logged in then we need to take them to the app and
every page is going to need that user information.

Most of the state in any given application is not needed globally, but user
state almost always is. So in an effort to avoid
[prop drilling madness](https://kentcdodds.com/blog/prop-drilling), we're going
to use context to store and manage the state of our app's authentication.

## Exercise

For this exercise, you'll be creating a new context provider and splitting up
the authenticated and unauthenticated parts of the app.

You'll find our helpful little emoji around the app.

Files:

- `src/context/auth-context.js`
- `src/index.js`
- `src/app.js`
- `src/unauthenticated-app.js`
- `src/authenticated-app.js`

## 🦉 Elaboration & Feedback

After the instruction, copy the URL below into your browser and fill out the
form: http://ws.kcd.im/?ws=build%20a%20react%20app&e=Auth&em=
