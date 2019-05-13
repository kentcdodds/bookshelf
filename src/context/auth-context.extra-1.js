/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {useAsync} from 'react-async'
import * as authClient from '../utils/auth-client'
import {FullPageSpinner} from '../components/lib'

const AuthContext = React.createContext()

function AuthProvider(props) {
  const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false)
  const {data, error, isRejected, isPending, isSettled, reload} = useAsync({
    promiseFn: authClient.getUser,
  })
  const {user} = data || {}

  React.useLayoutEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true)
    }
  }, [isSettled])

  if (!firstAttemptFinished) {
    if (isPending) {
      return <FullPageSpinner />
    }
    if (isRejected) {
      return (
        <div style={{color: 'red'}}>
          <p>Uh oh... There's a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      )
    }
  }

  const login = form => authClient.login(form).then(reload)
  const register = form => authClient.register(form).then(reload)
  const logout = () => authClient.logout().then(reload)

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
