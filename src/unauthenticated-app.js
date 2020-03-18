import React from 'react'
import Logo from './components/logo'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
import {CircleButton, Button, Spinner, FormGroup} from './components/lib'
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
    <form onSubmit={handleSubmit} className="flex flex-col items-stretch">
      <FormGroup className="w-full max-w-xs mx-auto my-3">
        <label htmlFor="username">Username</label>
        <input id="username" />
      </FormGroup>
      <FormGroup className="w-full max-w-xs mx-auto my-3">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </FormGroup>
      <div className="w-full max-w-xs mx-auto my-3">
        <Button type="submit">
          {buttonText} {isPending ? <Spinner className="ml-1" /> : null}
        </Button>
      </div>
      {isRejected ? <div className="text-red-500">{error?.message}</div> : null}
    </form>
  )
}

function Modal({button, label, children}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {React.cloneElement(button, {onClick: () => setIsOpen(true)})}
      <Dialog aria-label={label} isOpen={isOpen}>
        <div className="flex justify-end">
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
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Logo width="80" height="80" />
      <h1 className="mb-5 text-4xl font-bold">Bookshelf</h1>
      <div className="grid grid-cols-2 gap-3">
        <Modal label="Login form" button={<Button>Login</Button>}>
          <div className="text-4xl text-center">Login</div>
          <LoginForm onSubmit={login} buttonText="Login" />
        </Modal>
        <Modal
          label="Registration form"
          button={<Button variant="secondary">Register</Button>}
        >
          <div className="text-4xl text-center">Register</div>
          <LoginForm onSubmit={register} buttonText="Register" />
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
