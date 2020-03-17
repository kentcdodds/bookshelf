import React from 'react'
import {ReactQueryConfigProvider} from 'react-query'
import {AuthProvider} from './auth-context'
import {UserProvider} from './user-context'

const queryConfig = {
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ReactQueryConfigProvider>
  )
}

export default AppProviders
