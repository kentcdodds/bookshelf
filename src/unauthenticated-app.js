/** @jsx jsx */
import {jsx} from '@emotion/core'

import tw from 'twin.macro'
import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
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
    <form onSubmit={handleSubmit} css={tw`flex flex-col items-stretch`}>
      <FormGroup css={tw`w-full max-w-xs mx-auto my-3`}>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </FormGroup>
      <FormGroup css={tw`w-full max-w-xs mx-auto my-3`}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </FormGroup>
      <div css={tw`w-full max-w-xs mx-auto my-3`}>
        <Button type="submit">
          {buttonText} {isPending ? <Spinner css={tw`ml-1`} /> : null}
        </Button>
      </div>
      {isRejected ? <div css={tw`text-red-500`}>{error?.message}</div> : null}
    </form>
  )
}

function Modal({button, label, children}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {React.cloneElement(button, {onClick: () => setIsOpen(true)})}
      <Dialog aria-label={label} isOpen={isOpen}>
        <div css={tw`flex justify-end`}>
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
    <div css={tw`flex flex-col items-center justify-center w-full h-screen`}>
      <Logo width="80" height="80" />
      <h1 css={tw`mb-5 text-4xl font-bold`}>Bookshelf</h1>
      <div css={tw`grid grid-cols-2 gap-3`}>
        <Modal label="Login form" button={<Button>Login</Button>}>
          <div css={tw`text-4xl text-center`}>Login</div>
          <LoginForm onSubmit={login} buttonText="Login" />
        </Modal>
        <Modal
          label="Registration form"
          button={<Button variant="secondary">Register</Button>}
        >
          <div css={tw`text-4xl text-center`}>Register</div>
          <LoginForm onSubmit={register} buttonText="Register" />
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
