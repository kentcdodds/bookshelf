/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
import { queryCache } from 'react-query'
import * as auth from 'auth-provider'
import { client } from 'utils/api-client'
import { useAsync } from 'utils/hooks'
import { setQueryDataForBook } from 'utils/books'
import { FullPageSpinner, FullPageErrorFallback } from 'components/lib'

async function bootstrapAppData() {
  let user = null

  const token = await auth.getToken()// utility from auth-provider that reads from local storage
  if (token) {
    const data = await client('bootstrap', { token })// call api endpoint, api-client
    queryCache.setQueryData('list-items', data.listItems, {// queryCache is from react-query
      staleTime: 5000,
    })
    for (const listItem of data.listItems) {
      setQueryDataForBook(listItem.book)
    }
    user = data.user
  }
  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,// part of  react query library
    status,// part of  react query library
    error,// part of  react query library
    isLoading,// part of  react query library
    isIdle,// part of  react query library
    isError,// part of  react query library
    isSuccess,// part of  react query library
    run,// custom hook utility to run async functions, arg: Promise
    setData,
  } = useAsync()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => auth.login(form).then(user => setData(user)),
    [setData],
  )
  const register = React.useCallback(
    form => auth.register(form).then(user => setData(user)),
    [setData],
  )
  const logout = React.useCallback(() => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }, [setData])

  const value = React.useMemo(() => ({ user, login, logout, register }), [
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

function useClient() {
  const { user } = useAuth()
  const token = user?.token
  return React.useCallback(
    (endpoint, config) => client(endpoint, { ...config, token }),
    [token],
  )
}

export { AuthProvider, useAuth, useClient }
