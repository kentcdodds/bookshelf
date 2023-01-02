import React from 'react'
import { createRoot } from 'react-dom/client'
import { Logo } from './components/logo'

const App = () => {
  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => console.log('Login clicked')}>Login</button>
      </div>
      <div>
        <button onClick={() => console.log('Register clicked')}>Register</button>
      </div>
    </div>
  )
}
const root = createRoot(document.getElementById('root'));
root.render(<App />);
