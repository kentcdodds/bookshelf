import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

const LoginForm = ({onSubmit, buttonText}) => {
  const handleSubmit = event => {
    event.preventDefault()
    const {username, password} = event.target.elements
    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
      </div>

      <div>
        <label htmlFor="password">Password </label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

const App = () => {
  const [openModal, setOpenModal] = useState('none')

  const login = formData => {
    console.log('login', formData)
  }
  const register = formData => {
    console.log('register', formData)
  }
  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>

      <div>
        <button onClick={() => setOpenModal('register')}>register</button>
      </div>

      <Dialog aria-label="login" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>close</button>

          <h1>login</h1>
          <LoginForm onSubmit={login} buttonText="Login" />
        </div>
      </Dialog>
      <Dialog aria-label="register" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>close</button>

          <h1>Register</h1>
          <LoginForm onSubmit={register} buttonText="Register" />
        </div>
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
