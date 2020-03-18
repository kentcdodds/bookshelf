import React from 'react'
import {queryCache} from 'react-query'
import {bootstrapAppData} from '../utils/bootstrap'
import * as authClient from '../utils/auth-client'
import useAsync from '../utils/use-async'
import {FullPageSpinner} from '../components/lib'

const AuthContext = React.createContext()

const appDataPromise = bootstrapAppData()

function AuthProvider(props) {
  const {data, status, error, isLoading, isError, isSuccess, run} = useAsync()

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
    queryCache.clear()
    run(bootstrapAppData())
  }, [run])

  const user = data?.user

  const value = React.useMemo(() => ({user, login, logout, register}), [
    login,
    logout,
    register,
    user,
  ])

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div className="text-red-500">
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
