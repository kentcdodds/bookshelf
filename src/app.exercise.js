import React from 'react'
import {useAuth} from './context/auth-context'
// 🐨 you'll want to render the FullPageSpinner as the fallback
// import {FullPageSpinner} from './components/lib'

// 🐨 exchange these for React.lazy calls
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const {user} = useAuth()
  // 🐨 wrap this in a <React.Suspense /> component
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export {App}
