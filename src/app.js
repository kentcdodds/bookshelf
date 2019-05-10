import React from 'react'
import {useAuth} from './context/auth-context'
import AuthenticatedApp from './authenticated-app'
import UnauthenticatedApp from './unauthenticated-app'

function App() {
  const {isLoading, user} = useAuth()
  return isLoading ? (
    '...'
  ) : user ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  )
}

export default App
