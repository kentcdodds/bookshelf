import React from 'react'
import {AuthProvider} from './auth-context'
import {UserProvider} from './user-context'
import {ListItemProvider} from './list-item-context'

function AppProviders({children}) {
  console.log('rendering in app providers')
  return (
    <AuthProvider>
      <UserProvider>
        <ListItemProvider>{children}</ListItemProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default AppProviders
