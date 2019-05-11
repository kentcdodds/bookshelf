import React from 'react'
import {useUser} from './context/user-context'
import AuthenticatedApp from './authenticated-app'
import UnauthenticatedApp from './unauthenticated-app'

function App() {
  const {isInitializing, user} = useUser()
  return isInitializing ? (
    '...'
  ) : user ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  )
}

export default App
