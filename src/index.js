import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Profiler} from 'components/profiler'
import {App} from './app'
import {AppProviders} from './context'

loadDevTools(() => {
  createRoot(document.getElementById('root')).render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
  )
})
