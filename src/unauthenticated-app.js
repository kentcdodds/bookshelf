/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
import * as colors from './styles/colors'
import {CircleButton, Button, Spinner, FormGroup} from './components/lib'
import Logo from './components/logo'
import {useAuth} from './context/auth-context'
import useAsync from './utils/use-async'

function LoginForm({onSubmit, buttonText}) {
  const {isPending, isRejected, error, run} = useAsync()
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }),
    )
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
      {isRejected ? (
        <div css={{color: colors.danger}}>{error?.message}</div>
      ) : null}
    </form>
  )
}

function Modal({button, label, children}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {React.cloneElement(button, {onClick: () => setIsOpen(true)})}
      <Dialog aria-label={label} isOpen={isOpen}>
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

function UnauthenticatedApp() {
  const {login, register} = useAuth()

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: '0.75rem',
        }}
      >
        <Modal label="Login form" button={<Button>Login</Button>}>
          <h3 css={{textAlign: 'center', fontSize: '2em'}}>Login</h3>
          <LoginForm onSubmit={login} buttonText="Login" />
        </Modal>
        <Modal
          label="Registration form"
          button={<Button variant="secondary">Register</Button>}
        >
          <h3 css={{textAlign: 'center', fontSize: '2em'}}>Register</h3>
          <LoginForm onSubmit={register} buttonText="Register" />
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
