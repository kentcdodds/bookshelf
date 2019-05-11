import React from 'react'
import {useUserState} from './context/user-context'
import {useListItemState} from './context/list-item-context'
import AuthenticatedApp from './authenticated-app'
import UnauthenticatedApp from './unauthenticated-app'

function App() {
  const userState = useUserState()
  const listItemState = useListItemState()
  const error = userState.isRejected
    ? userState.error
    : listItemState.isRejected
    ? listItemState.error
    : null

  if (error) {
    return (
      <div style={{color: 'red'}}>
        <p>There was an error:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (userState.isPending || listItemState.isPending) {
    return '...'
  }

  if (userState.isResolved && listItemState.isResolved) {
    return <AuthenticatedApp />
  }

  return <UnauthenticatedApp />
}

export default App
