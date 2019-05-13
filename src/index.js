import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
// 🐨 import the AuthProvider from ./context/auth-context

// 🐨 wrap <App /> in the AuthProvider
ReactDOM.render(<App />, document.getElementById('root'))
