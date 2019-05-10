import React from 'react'
import {useAuth} from './context/auth-context'
import AuthenticatedApp from './authenticated-app'
import UnauthenticatedApp from './unauthenticated-app'

function App() {
  const {isInitializing, user} = useAuth()
  return isInitializing ? (
    '...'
  ) : user ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  )
}

export default App
