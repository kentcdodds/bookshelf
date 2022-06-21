# Performance

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

One of the most common performance problems web applications face is initial
page load. As the application grows, the size of the JavaScript bundle grows as
well. With every feature, you add more dependencies and your own code to the
size of the JavaScript bundle you're sending to users.

This has adverse performance affects because it takes longer to send that data
over the internet and it also takes more time for the browser to process that
data (for example: to parse and run the JavaScript).

But no matter how big your application grows, it's unlikely the user needs
_everything_ your application can do on the page at the same time. So if instead
we split the application code and assets into logical "chunks" then we could
load only the chunks necessary for what the user wants to do right now.

This is called "Code splitting".

📜 Here are some relevant docs from React

- [Code-splitting in the React Docs](https://reactjs.org/docs/code-splitting.html)

This optimization is intended to improve what's called the
["Time to First Meaningful Paint"](https://web.dev/first-meaningful-paint/). The
sooner users can see the content they're coming for, the better and this is a
metric for measuring this.

## Exercise

Production deploys:

- [Exercise](https://exercises-09-performance.bookshelf.lol/exercise)
- [Final](https://exercises-09-performance.bookshelf.lol/)

This exercise is all about improving the time to first meaningful paint. Our app
is pretty small as it is, so some of our optimizations might be a little
overkill. We're already scoring 99/100 on our
[Lighthouse](https://developers.google.com/web/tools/lighthouse) score, but in
medium-to-large size apps, these changes will make much more significant and
valuable impacts on the performance of your application in production.

In fact, with an app as small as this, it's hard to get measurements indicating
that we've improved things at all, so the optimizations we'll do in this
exercise should really only be applied to larger apps. As always: measure before
and after and choose the faster one!

👨‍💼 We're having people close the browser before our login page finishes loading!
We need the login page to load faster!

We have two parts of our app, the authenticated side, and the unauthenticated
side. The users who are coming to the unauthenticated app are loading everything
in the app even though they're not using it all.

So your job is to implement "Code Splitting" so we lazily load the Authenticated
app so users don't have to pay the cost for the authenticated app until they've
actually logged in.

> 💰 Remember, `React.lazy` expects the module you're importing to export a
> React component as the default export. So you'll need to update those exports.
> Also, due to the way we're structuring the exercises, you'll also need to
> update the "main" module that's re-exporting things. So you'll make a change
> to `src/authenticated-app.exercise.js` as well as `src/authenticated-app.js`!

### Files

- `src/app.js`
- `src/authenticated-app.js`
- `src/unauthenticated-app.js`

## Extra Credit

### 1. 💯 Prefetch the Authenticated App

[Production deploy](https://exercises-09-performance.bookshelf.lol/extra-1)

When the user lands on the login screen, it's really likely they'll want to load
the regular app, so go ahead and use
[webpack magic comments](https://webpack.js.org/api/module-methods/#magic-comments)
to prefetch the authenticated app module.

This will reduce the amount of time it takes to render the authenticated app
once the user logs in because the code will be pre-loaded, but the user won't
have to wait for that code to download before they can use the login screen.

**Files:**

- `src/app.js`

### 2. 💯 Memoize context

[Production deploy](https://exercises-09-performance.bookshelf.lol/extra-2)

If a context provider re-renders with a different `value` from the previous
render, all consumers will re-render. When writing idiomatic context provider
components which are rendered globally in your app, you can take advantage of
[this built-in optimization](https://kentcdodds.com/blog/optimize-react-re-renders),
and the only time the provider re-renders is when the state actually changes
(which is when you _want_ consumers to re-render anyway).

However, it's often a good idea to memoize the functions we expose through
context so those functions can be passed into dependency arrays. And we'll
memoize the context value as well.

**Files:**

- `src/context/auth-context.js`

### 3. 💯 Production Monitoring

[Production deploy](https://exercises-09-performance.bookshelf.lol/extra-3)

We want to be able to monitor the application performance in production so we
can be notified if there's a huge spike in performance issues. There's a small
performance penalty cost for this so we have modify how the app is built so it
includes the React profiling tools, but having the information is often worth
the cost. Facebook actually will only serve the profiling-enabled build of their
app to a subset of users and that's something that you might consider when
adding this to your own app.

Because we're using `react-scripts` (thanks to create-react-app), we can use the
`--profile` flag to enable building for production with the profiling
information enabled. In fact, we're already doing this, but I wanted to make
sure you don't miss that step. For more information on this, read
[Profile a React App for Performance](https://kentcdodds.com/blog/profile-a-react-app-for-performance).

With that in place, we can now tell React where we want to start collecting
performance information. We're going to be using React's
[`<Profiler />`](https://reactjs.org/docs/profiler.html) component to do this
performance measuring and reporting. You'll want to send the data for the
profile in a `POST` request to `/profile` (`client('profile', {body: data}))`).
Note that it is not necessary to send a `token` because this is not an
authenticated request (because we want this to happen for unauthenticated users
too).

There are lots of ways to go about doing this and you can feel free to do this
however you like, but in my finished example, I created a component with the
following API:

```javascript
<Profiler id="Unique Identifier" metadata={{extra: 'info for the report'}}>
  <Components />
  <To />
  <Be />
  <Profiled />
</Profiler>
```

Then the `Profiler` will be responsible for sending the profile data that we get
from React to the `/profile` endpoint.

There are various places where this information might be useful. You can feel
free to add it wherever you like.

**Files:**

- `src/components/profiler.js`
- `src/index.js`
- `src/components/list-item-list.js`
- `src/screens/book.js`
- `src/screens/discover.js`

... 4. 💯 Add interaction tracing

This API was removed from React, so we've deleted the video and exercise from
this workshop. Learn more: https://github.com/facebook/react/issues/21285

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=09%3A%20Performance&em=
