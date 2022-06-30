/** @jsx jsx */
import {jsx} from '@emotion/core'
import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const [user, setUser] = React.useState(null)
  // login function that calls auth.login then sets the user
  const login = form => auth.login(form).then(u => setUser(u))
  // registration function that does the same as login except for register
  const register = form => auth.login(form).then(u => setUser(u))
  // logout function that calls auth.logout() and sets the user to null
  const logout = () => {
    auth.logout()
    setUser(null)
  }

  // check if user, render components and props accordingly
  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
