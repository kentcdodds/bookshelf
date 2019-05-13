import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import {AuthProvider} from './context/auth-context'
// import {AuthProvider} from './context/auth-context.finished'
// import {AuthProvider} from './context/auth-context.extra-1'

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root'),
)
