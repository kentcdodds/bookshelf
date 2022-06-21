# Render as you fetch

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

Something that negatively impacts the performance of our application is what's
called the "waterfall effect." This gets its name from the "waterfall" view in
the browser's Network developer tools which shows when the browser starts
requesting a certain asset and when the request for that asset finishes. There
are some assets we need to load before the app can render the initial page. The
earlier we can start requesting those assets, the faster we can show the user
their data.

Lazily loading code is great because it means the user doesn't have to load
stuff they're not going to need until they actually need it. However, it can
come with a cost of waterfalls which means your user is left waiting for one
request (for code, data, or assets) to finish loading before they can start
requesting the next bit needed code, data, or assets.

Render as you fetch is all about kicking off requests for the needed code, data,
or assets as soon as you have the information you need to retrieve them. You go
about this by applying this process:

1. Take a look at everything you're loading
2. Determine the minimal amount of things you need to start rendering something
   useful to the user
3. Start loading those things as soon as you possibly can

## Exercise

Production deploys:

- [Exercise](https://exercises-10-render-as-you-fetch.bookshelf.lol/exercise)
- [Final](https://exercises-10-render-as-you-fetch.bookshelf.lol/)

In this exercise, we're going to see how we can squeeze our network waterfall
over the left as much as we can for the things the user needs. We're a little
limited because this is a client-side application only. You can take this
further with server side rendered applications. So if your app requires
_screaming_ fast performance, then consider investigating a server-side
rendering framework like [Next.js](https://nextjs.org/) or a static site
generation framework like [Gatsby](https://www.gatsbyjs.com/).

Here's what happens when a logged-in user goes to our app:

1. Get the document (`index.html`)
2. Get the linked JS (`<script src="...">`) and CSS
   (`<link rel="stylesheet" href="...">`)
3. Parse the JS
4. Execute the JS

By code-splitting, we're reducing the amount of work the browser has to do in
step 3 and 4. But there's more we can do during that execute JS step. Let's
break down what happens in our app as the browser executes the JavaScript:

1. Call into all the modules (in import order)
2. Create a bunch of React components
3. Render those components with `ReactDOM.render`. At this point, React calls
   into all of our components to get the react elements
4. Our components are "mounted" by React and our `useEffect` callbacks are
   called
5. We make a fetch to get the logged in user's information and the AuthProvider
   displays a spinner while we wait.
6. The user's information comes back successfully, so now we render the
   Authenticated app (luckily we've pre-fetched that thanks to the webpack magic
   comment)
7. We make a fetch to get the user's list items. We show an empty list while we
   wait.
8. The list items come back and we render those list items.

So what's the optimization we can make here? Well, everywhere you see "while we
wait" could be optimized further. In particular, we could start fetching the
user's information as well as their list items as soon as our JavaScript
executes rather than waiting for the app to render all our components.

For this first exercise, let's just start by triggering the fetch for the user
earlier in the chain of events. Specifically, we'll start the user fetch request
to something that happens during step 1.

### Files

- `src/context/auth-context.js`

## Extra Credit

### 1. 💯 Preload all initial data

[Production deploy](https://exercises-10-render-as-you-fetch.bookshelf.lol/extra-1)

For this extra credit, we want to move the list items fetch request to something
that happens during step 1 as well. Luckily for us, our backend engineers are on
board with that, so they created a special endpoint that will give you all the
data you need in one request (otherwise we'd have to make multiple requests
which is fine, just not as cool).

If you make a GET to the endpoint `bootstrap`, it will send you an object with
the `user` and the user's `listItems`. You can use the `user` just like we're
doing right now with the `me` endpoint (stick it in our AuthProvider), and then
you can put the `listItems` in the `queryCache` so the user has their list items
all ready to go as soon as the app finishes loading.

This will make a noticeable impact on the loading experience. You'll notice this
improvement if you have a user with list items, then open their `/list` page.
Before this change, you'll see a blank list and the list items will then appear
a moment later. With this change, the list items are there instantly.

📜
[`queryCache.setQueryData` docs](https://github.com/tannerlinsley/react-query/tree/24bac238bb17dda042fe611ded536f7c422cdea9#querycachesetquerydata)

**Files:**

- `src/context/auth-context.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=10%3A%20Render%20as%20you%20fetch&em=
