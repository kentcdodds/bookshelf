/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import * as authClient from '../utils/auth-client'

const AuthContext = React.createContext()

function AuthProvider(props) {
  const [user, setUser] = React.useState(null)

  const login = form => authClient.login(form).then(u => setUser(u))
  const register = form => authClient.register(form).then(u => setUser(u))
  const logout = () => authClient.logout().then(u => setUser(u))

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
      }}
      {...props}
    />
  )
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {AuthProvider, useAuth}
