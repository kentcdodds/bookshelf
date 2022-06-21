// 🐨 here are the things you're going to need for this test:
// import * as React from 'react'
// import {render, screen, waitFor} from '@testing-library/react'
// import {queryCache} from 'react-query'
// import {buildUser, buildBook} from 'test/generate'
// import * as auth from 'auth-provider'
// import {AppProviders} from 'context'
// import {App} from 'app'

// 🐨 after each test, clear the queryCache and auth.logout

test.todo('renders all the book information')
// 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value (can be anything for now)

// 🐨 create a user using `buildUser`
// 🐨 create a book use `buildBook`
// 🐨 update the URL to `/book/${book.id}`
//   💰 window.history.pushState({}, 'page title', route)
//   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState

// 🐨 reassign window.fetch to another function and handle the following requests:
// - url ends with `/bootstrap`: respond with {user, listItems: []}
// - url ends with `/list-items`: respond with {listItems: []}
// - url ends with `/books/${book.id}`: respond with {book}
// 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
// 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})

// 🐨 render the App component and set the wrapper to the AppProviders
// (that way, all the same providers we have in the app will be available in our tests)

// 🐨 use findBy to wait for the book title to appear
// 📜 https://testing-library.com/docs/dom-testing-library/api-async#findby-queries

// 🐨 assert the book's info is in the document
