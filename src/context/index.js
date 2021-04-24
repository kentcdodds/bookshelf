import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClientProvider} from './query-client'
import {AuthProvider} from './auth-context'

function AppProviders({children}) {
  return (
    <QueryClientProvider>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export {AppProviders}
