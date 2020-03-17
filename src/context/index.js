import React from 'react'
import {ReactQueryConfigProvider} from 'react-query'
import {AuthProvider} from './auth-context'

const queryConfig = {
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryConfigProvider>
  )
}

export default AppProviders
