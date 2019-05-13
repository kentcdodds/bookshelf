import React from 'react'
import {AuthProvider} from './auth-context'
import {UserProvider} from './user-context'
import {FullPageSpinner} from '../components/lib'

function AppProviders({children}) {
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </React.Suspense>
  )
}

export default AppProviders
