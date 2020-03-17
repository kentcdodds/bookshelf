/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {bootstrapAppData} from '../utils/bootstrap'
import * as authClient from '../utils/auth-client'
import useAsync from '../utils/use-async'
import {FullPageSpinner} from '../components/lib'

const AuthContext = React.createContext()

const appDataPromise = bootstrapAppData()

function AuthProvider(props) {
  const {data, error, status, run} = useAsync()

  React.useLayoutEffect(() => {
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => authClient.login(form).then(() => run(bootstrapAppData())),
    [run],
  )
  const register = React.useCallback(
    form => authClient.register(form).then(() => run(bootstrapAppData())),
    [run],
  )
  const logout = React.useCallback(
    () => authClient.logout().then(() => run(bootstrapAppData())),
    [run],
  )

  if (status === 'pending' || status === 'idle') {
    return <FullPageSpinner />
  }

  if (status === 'rejected') {
    return (
      <div css={{color: 'red'}}>
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{data, login, logout, register}} {...props} />
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
