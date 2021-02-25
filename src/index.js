import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {DiscoverBooksScreen} from './discover'

loadDevTools(() => {
  ReactDOM.render(<DiscoverBooksScreen />, document.getElementById('root'))
})
