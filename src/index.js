import { loadDevTools } from './dev-tools/load'
import './bootstrap'// start server by loading dev-server who manage server-handlers, bootstrap loads other common assets
import * as React from 'react'
import ReactDOM from 'react-dom'
import { Profiler } from 'components/profiler'
import { App } from './app'
import { AppProviders } from './context'

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  )
})
