import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import AppProviders from './context'

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
)
