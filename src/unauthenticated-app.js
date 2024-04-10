/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {Input, Button, Spinner, FormGroup, ErrorMessage} from './components/lib'
import {Modal, ModalContents, ModalOpenButton} from './components/modal'
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

function UnauthenticatedApp() {
  const {login, register} = useAuth()
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',

        width: '100%',
        height: '100vh',
      }}
    >
      <div
        css={{
          background: '#e86c60',
          width: '33.33%',
          height: '100vh',
          borderRight: '1px solid   #fff',
          borderRightWidth: 5,
          borderTopRightRadius: '150%',
          borderBottomRightRadius: '50%',
          '@media (max-width: 768px)': {
            display: 'none',
          },
        }}
      ></div>
      <div
        css={{
          width: '33.33%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            width: '100%',
          },
        }}
      >
        {' '}
        <Logo width="80" height="80" />
        <h1
          className="
text-design-stroke"
        >
          Bookshelf
        </h1>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridGap: '0.75rem',
          }}
        >
          <Modal>
            <ModalOpenButton>
              <Button variant="primary">Login</Button>
            </ModalOpenButton>
            <ModalContents aria-label="Login form" title="Login">
              <LoginForm
                onSubmit={login}
                submitButton={<Button variant="primary">Login</Button>}
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
      <div
        css={{
          background: '#43a6dd',
          width: '33.33%',
          height: '100vh',
          borderLeft: '1px solid #fff',
          borderLeftWidth: 1,
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '150%',
          '@media (max-width: 768px)': {
            display: 'none',
          },
        }}
      ></div>
    </div>
  )
}

export default UnauthenticatedApp
