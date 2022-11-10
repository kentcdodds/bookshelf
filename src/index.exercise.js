// 🐨 you'll need to import react and createRoot from react-dom up here
// 🐨 you'll also need to import the Logo component from './components/logo'
import * as React from 'react'
import {Logo} from './components/logo'
import {createRoot} from 'react-dom/client'
// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

const App = () => {
  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div className="btn-container">
        <button type="button" onClick={() => alert('log in')}>
          Log in
        </button>
        <button type="button" onClick={() => alert('register')}>
          Register
        </button>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}

// 🐨 use createRoot to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
