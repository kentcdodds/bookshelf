/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import * as authClient from './utils/auth-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const [user, setUser] = React.useState(null)

  const login = form => authClient.login(form).then(u => setUser(u))
  const register = form => authClient.register(form).then(u => setUser(u))
  const logout = () => {
    authClient.logout()
    setUser(null)
  }

  const props = {user, login, register, logout}
  return user ? (
    <AuthenticatedApp {...props} />
  ) : (
    <UnauthenticatedApp {...props} />
  )
}

export {App}
