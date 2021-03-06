import * as React from 'react'
import ReactDOM from 'react-dom'
import {Logo} from './components/logo'

function App() {
  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => alert('login clicked')}>Login</button>
      </div>
      <div>
        <button onClick={() => alert('register clicked')}>Register</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
