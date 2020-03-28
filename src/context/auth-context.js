/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {bootstrapAppData} from 'utils/bootstrap'
import * as authClient from 'utils/auth-client'
import {useAsync} from 'utils/use-async'
import * as colors from 'styles/colors'
import {FullPageSpinner} from 'components/lib'

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

const appDataPromise = bootstrapAppData()

function AuthProvider(props) {
  const {
    data,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
  } = useAsync()

  const runBootstrap = React.useCallback(() => run(bootstrapAppData()), [run])

  React.useLayoutEffect(() => {
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => authClient.login(form).then(runBootstrap),
    [runBootstrap],
  )
  const register = React.useCallback(
    form => authClient.register(form).then(runBootstrap),
    [runBootstrap],
  )
  const logout = React.useCallback(() => {
    authClient.logout()
    run(bootstrapAppData())
  }, [run])

  const user = data?.user

  const value = React.useMemo(() => ({user, login, logout, register}), [
    login,
    logout,
    register,
    user,
  ])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {AuthProvider, useAuth}
