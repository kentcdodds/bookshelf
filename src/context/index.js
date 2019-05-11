import React from 'react'
import {UserProvider} from './user-context'
import {ListItemProvider} from './list-item-context'

function AppProviders({children}) {
  return (
    <UserProvider>
      <ListItemProvider>{children}</ListItemProvider>
    </UserProvider>
  )
}

export default AppProviders
