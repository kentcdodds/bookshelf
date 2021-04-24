/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {useQueryClient} from 'react-query'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {setQueryDataForBook} from 'utils/books'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

async function bootstrapAppData(queryClient) {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('bootstrap', {token})
    queryClient.setQueryData('list-items', data.listItems, {
      staleTime: 5000,
    })
    for (const listItem of data.listItems) {
      setQueryDataForBook(queryClient, listItem.book)
    }
    user = data.user
  }
  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  const queryClient = useQueryClient()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData(queryClient)
    run(appDataPromise)
  }, [run, queryClient])

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
    queryClient.clear()
    setData(null)
  }, [setData, queryClient])

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

function useClient() {
  const {user} = useAuth()
  const token = user?.token
  return React.useCallback(
    (endpoint, config) => client(endpoint, {...config, token}),
    [token],
  )
}

export {AuthProvider, useAuth, useClient}
