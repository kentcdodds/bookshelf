/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {bootstrapAppData} from 'utils/bootstrap'
import * as authClient from 'utils/auth-client'
import {useAsync} from 'utils/use-async'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

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
    setData,
  } = useAsync()

  React.useLayoutEffect(() => {
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => authClient.login(form).then(user => setData({user})),
    [setData],
  )
  const register = React.useCallback(
    form => authClient.register(form).then(user => setData({user})),
    [setData],
  )
  const logout = React.useCallback(() => {
    authClient.logout()
    setData(null)
  }, [setData])

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
    return <FullPageErrorFallback error={error} />
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
