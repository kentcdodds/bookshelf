# E2E Testing

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

> "The more your tests resemble the way your software is used, the more
> confidence they can give you".
> [– Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106)

This is
[the guiding principle of Testing Library](https://testing-library.com/docs/guiding-principles).
By following this principle, your tests will give you much needed confidence
(which is why they exist in the first place).

There's no better way to make automated tests resemble the way the user will use
your software than to program an _actual browser_ to interact with your
application the same way a user would. Without access to any internals, without
mocking the backend, etc. This is called an "End-to-End" test (or E2E).

So far, our tests have been much more granular and have mocked out HTTP
requests. In this case we're trading some confidence for some
convenience/practicality. When a failure happens in our unit test, it's normally
pretty straightforward to know what went wrong. Contrast that with an E2E test
which is sometimes very difficult to triage the root of the issues.

This is why we spend most of our time with integration tests because
[they give us the most bang for our buck](https://kentcdodds.com/blog/write-tests).
That said, a single E2E test can give us a HUGE amount of confidence and
confidence that we can't reasonably have any other way. For example, we have
nothing giving us automatic confidence that the application works with the
_real_ backend. So having a single E2E test can give us confidence that we've
wired things up properly.

Often these kinds of tests will run with a local instance of the backend or
perhaps referencing a "staging" server that's run for development. An
alternative approach is to actually run tests _in production_ (with the use of
feature flags). Listen to a super interesting take on this kind of testing on
the [Chats with Kent podcast](https://kentcdodds.com/podcast):
[Talia Nassi on Testing in Production](https://kentcdodds.com/chats-with-kent-podcast/seasons/03/episodes/talia-nassi-on-testing-in-production)

However you configure things to run, E2E tests can give you a great deal of
confidence. There are various tools you can use to accomplish this browser
automation. We'll be using [Cypress](https://www.cypress.io/) which has a
[Testing Library Implementation](https://testing-library.com/cypress) so things
should feel pretty familiar to you. The biggest difference is that you'll be
using the cypress `cy` utility for queuing up commands that cypress will execute
and you'll use the `find*` variant of the queries exclusively.

Here's a quick example of how to write a cypress test:

```javascript
describe('smoke', () => {
  it('should allow a typical user flow', () => {
    // 📜 https://docs.cypress.io/api/commands/visit.html
    cy.visit('/some-app-route')

    // 📜 https://github.com/testing-library/cypress-testing-library/tree/17c11b47d2649dc3eb5ff62f66dea566030f4613#usage
    cy.findByRole('button', {name: /click me/i}).click()

    // imagine clicking the button opens a modal window. If we want to scope our
    // queries to that dialog, we can search for it, and then use `within`:
    // 📜 https://docs.cypress.io/api/commands/within.html#Syntax
    cy.findByRole('dialog').within(() => {
      // 📜 https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Assertions
      cy.findByRole('alert').should('contain', 'Oh no! You clicked the button!')
    })
  })
})
```

We have cypress configured for you in the `cypress.config.js` file, we have
`@testing-library/cypress` setup in the `cypress/support/e2e.js` file, and we
have the following scripts for you to run in the `package.json`:

- `npm run test:e2e` - locally, this will run the app dev server and start
  cypress. In CI this will build the project, run a static file server for the
  built files, and run cypress headlessly on the built app. **This should be the
  only script you need to run**.
- `npm run cy:open` - If you're already running the dev server, then you can run
  this to open cypress.

For unit tests, we're often testing a single function. For integration tests,
we're normally testing a single screen. For E2E tests, we're putting it all
together and testing the application as a whole. This means that typically the
E2E test follows a typical user flow which results in a longer, more
comprehensive test that allows you to cover a lot of the most important use
cases for your application.

Just be careful to avoid "repeat testing" as described in
[Common Testing Mistakes](https://kentcdodds.com/blog/common-testing-mistakes#mistake-number-3-repeat-testing).

## Exercise

Production deploys:

- [Exercise](https://exercises-14-e2e-testing.bookshelf.lol/exercise)
- [Final](https://exercises-14-e2e-testing.bookshelf.lol/)

For this exercise, we're going to test the following user flow:

- Arrive at the app and register
- Go to the discover page and search for a book
- Add that book to the reading list
- Go to the reading list and then go to the book page
- Add some notes
- Mark the book as read
- Give the book a 5 star rating
- Go to the finished books screen
- Verify the book shows up and has a 5 star rating
- Click the book to go back to it's page
- Remove it from the reading list
- Make sure the notes and rating are gone
- Go to the finished books screen and make sure that list is empty

The emoji will be around to help you know what to do! Good luck!

### Files

- `cypress/e2e/smoke.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=14%3A%20E2E%20Testing&em=
