/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {useQuery} from 'react-query'
import {bootstrapAppData} from '../utils/bootstrap'
import * as authClient from '../utils/auth-client'
import {FullPageSpinner} from '../components/lib'

const AuthContext = React.createContext()

const defaultData = {
  user: null,
  listItems: [],
}

function AuthProvider(props) {
  const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false)
  const {data, error, status, refetch} = useQuery(
    'bootstrapAppData',
    bootstrapAppData,
    {manual: true, refetchOnWindowFocus: false},
  )

  React.useLayoutEffect(() => {
    if (!status === 'loading') {
      setFirstAttemptFinished(true)
    }
  }, [status])

  if (!firstAttemptFinished) {
    if (status === 'loading') {
      return <FullPageSpinner />
    }
    if (error) {
      return (
        <div css={{color: 'red'}}>
          <p>Uh oh... There's a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      )
    }
  }

  const login = form => authClient.login(form).then(refetch)
  const register = form => authClient.register(form).then(refetch)
  const logout = () => authClient.logout().then(refetch)

  return (
    <AuthContext.Provider
      value={{data: data ? data : defaultData, login, logout, register}}
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
