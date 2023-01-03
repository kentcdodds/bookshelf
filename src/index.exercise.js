/** @jsx jsx */
import { jsx } from '@emotion/core'
// up here so you can use the css prop

// 🐨 let's get a solid reset of global styles so everything looks a bit better
// In this project we're using bootstrap-reboot which you can import from
import 'bootstrap/dist/css/bootstrap-reboot.css'
// 🦉 Note: you can definitely use regular styles to style React apps
// and using any modern toolchain will allow you to simply import the CSS file
// but CSS-in-JS is generally easier to maintain.
import '@reach/dialog/styles.css'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
// 🐨 you'll need to import some new components that you'll be creating
// in this file
import { Button, Input, FormGroup } from './components/lib'
import { Modal, ModalContents, ModalOpenButton } from './components/modal'
import { Logo } from './components/logo'

function LoginForm({ onSubmit, submitButton }) {
  function handleSubmit(event) {
    event.preventDefault()
    const { username, password } = event.target.elements

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      '> div': {
        margin: '10px auto',
        width: '100%',
        maxWidth: '300px',
      },

    }}>
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>{React.cloneElement(submitButton, { type: 'submit' })}</div>
    </form>
  )
}

function App() {
  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <div css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh',
    }}>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div css={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridGap: '0.75rem',
      }}>
        <Modal>
          <ModalOpenButton>
            <Button>Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm
              onSubmit={login}
              submitButton={<Button>Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export { root }
