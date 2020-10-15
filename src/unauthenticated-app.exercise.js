/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {
  Input,
  CircleButton,
  Button,
  Spinner,
  FormGroup,
  ErrorMessage,
  // 💣 when you're all done, you won't need this Dialog anymore
  // you can remove this now or later when you've finished
  Dialog,
} from './components/lib'
// 🐨 import all the Modal compound components you created in ./components/modal
import {Logo} from './components/logo'
import {useAuth} from './context/auth-context'
import {useAsync} from './utils/hooks'

function LoginForm({onSubmit, submitButton}) {
  const {isLoading, isError, error, run} = useAsync()
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
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        {React.cloneElement(
          submitButton,
          {type: 'submit'},
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner css={{marginLeft: 5}} /> : null,
        )}
      </div>
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

// 💣 when you're all done, you'll be able to completely delete this
function LoginFormModal({
  onSubmit,
  modalTitleText,
  modalLabelText,
  submitButton,
  openButton,
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <React.Fragment>
      {React.cloneElement(openButton, {onClick: () => setIsOpen(true)})}
      <Dialog
        aria-label={modalLabelText}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      >
        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
          {/* 💰 here's what you should put in your <ModalDismissButton> */}
          <CircleButton onClick={() => setIsOpen(false)}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
        <h3 css={{textAlign: 'center', fontSize: '2em'}}>{modalTitleText}</h3>
        <LoginForm onSubmit={onSubmit} submitButton={submitButton} />
      </Dialog>
    </React.Fragment>
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
        {/* 🐨 replace both of these with the Modal compound components */}
        {/*
          🦉 when you're done, it'll look a lot more complicated than
             it did when you started, but the extra credits will help clean
             things up a bit.
        */}
        <LoginFormModal
          onSubmit={login}
          modalTitle="Login"
          modalLabelText="Login form"
          submitButton={<Button variant="primary">Login</Button>}
          openButton={<Button variant="primary">Login</Button>}
        />
        <LoginFormModal
          onSubmit={register}
          modalTitle="Register"
          modalLabelText="Registration form"
          submitButton={<Button variant="secondary">Register</Button>}
          openButton={<Button variant="secondary">Register</Button>}
        />
      </div>
    </div>
  )
}

export {UnauthenticatedApp}
