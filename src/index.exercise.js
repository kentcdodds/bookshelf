import React from 'react'
import ReactDOM from 'react-dom'

import {Logo} from 'components/logo'

const App = () => {
  return (
    <>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={() => alert('Login clicked')}>Login</button>
      <button onClick={() => alert('Register clicked')}>Register</button>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
