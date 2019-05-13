import React from 'react'
import * as authClient from '../utils/auth-client'

// 🐨 create your AuthContext here
// 💰 use React.createContext()

function AuthProvider(props) {
  // 💯 see if you can load the current user before rendering the rest of the app.
  // 💰 1. You can use authClient.getMe to attempat to load the user.
  // 💰 2. You might like react-async to drastically reduce the amount of code
  // needed to manage the state of doing this. (This is not an easy extra credit
  // especially if you're unfamiliar with react-async).

  // 🐨 bring login, register, and logout from the original /unauthenticated-app.js
  // to here.

  // 🐨 render the AuthContext.Provider here with the value to include
  // {user, login, logout, register}
  // 💰 don't forget to render {props.children} in the provider here!
  return <div>context/auth-context.js TODO</div>
}

function useAuth() {
  // 🐨 get and return the context for AuthContext
  // 💰 use React.useContext
}

export {AuthProvider, useAuth}
// export * from './auth-context.finished'
// export * from './auth-context.extra-1'

/* eslint no-unused-vars:0 */
