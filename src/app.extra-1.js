/** @jsx jsx */
import {jsx} from '@emotion/core'

import styled from '@emotion/styled'
import React from 'react'
import Logo from './components/logo'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
import {
  CircleButton,
  Button,
  FormGroup,
  Centered,
  Spinner,
} from './components/lib'
import * as authClient from './utils/auth-client'

function LoginForm({onSubmit, buttonText}) {
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState(null)
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    setIsPending(true)
    onSubmit({
      username: username.value,
      password: password.value,
    })
      .catch(e => {
        setError(e)
        return Promise.reject(e)
      })
      .finally(() => setIsPending(false))
  }

  return (
    <form
      onSubmit={handleSubmit}
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </FormGroup>
      <div>
        <Button type="submit">
          {buttonText} {isPending ? <Spinner css={{marginLeft: 5}} /> : null}
        </Button>
      </div>
      {error ? (
        <div css={{color: 'red'}}>{error ? error.message : null}</div>
      ) : null}
    </form>
  )
}

function Modal({button, children}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {React.cloneElement(button, {onClick: () => setIsOpen(true)})}
      <Dialog isOpen={isOpen}>
        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
          <CircleButton onClick={() => setIsOpen(false)}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
        {children}
      </Dialog>
    </>
  )
}

const ModalTitle = styled.h3({
  textAlign: 'center',
  fontSize: '2em',
})

function App() {
  const [user, setUser] = React.useState(null)

  function login({username, password}) {
    return authClient.login({username, password}).then(u => setUser(u))
  }

  function register({username, password}) {
    return authClient.register({username, password}).then(u => setUser(u))
  }

  function logout() {
    return authClient.logout().then(() => setUser(null))
  }

  if (user) {
    return (
      <div>
        {user.username} is logged in!{' '}
        <button type="button" onClick={logout}>
          logout
        </button>
      </div>
    )
  }

  return (
    <Centered>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div css={{display: 'flex'}}>
        <Modal button={<Button css={{marginRight: 6}}>Login</Button>}>
          <ModalTitle>Login</ModalTitle>
          <LoginForm onSubmit={login} buttonText="Login" />
        </Modal>
        <Modal button={<Button variant="secondary">Register</Button>}>
          <ModalTitle>Register</ModalTitle>
          <LoginForm onSubmit={register} buttonText="Register" />
        </Modal>
      </div>
    </Centered>
  )
}

export default App
