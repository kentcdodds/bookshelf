import React from 'react'
import {Dialog} from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import {useAuth} from './context/auth-context'

function LoginForm({onSubmit}) {
  function handleSubmit(event) {
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
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

function Modal({buttonText, children}) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(true)}>{buttonText}</button>
      <Dialog isOpen={isOpen}>
        <button onClick={() => setIsOpen(false)}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        {children}
      </Dialog>
    </>
  )
}

function UnauthenticatedApp() {
  const {login, register} = useAuth()

  return (
    <div>
      <h1>Bookshelf</h1>
      <div>
        <Modal buttonText="Login">
          <strong>Login</strong>
          <LoginForm onSubmit={login} />
        </Modal>
        <Modal buttonText="Register">
          <strong>Register</strong>
          <LoginForm onSubmit={register} />
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
