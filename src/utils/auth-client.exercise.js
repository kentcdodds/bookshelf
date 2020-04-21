// 🐨 just like the books-client, this file will need the client from './api-client'
// 🐨 we'll also need to know what the localStorageKey is and we're going to define
// that in the './api-client' so import that as well.

// 🐨 you'll need a few methods in here that will make client requests and will interact with localStorage:

// 1. login: calls client with username and password as the body and then set's the token into localStorage and returns the user
// 💰 client('login', {body: {username, password}}).then(user => {
// 💰   // set user.token in localStorage
// 💰   // return the user
// 💰 })

// 2. register: does basically the same as login except it calls the register endpoint instead of login

// 3. logout: removes the token from localStorage

// 🐨 export login, register, and logout
