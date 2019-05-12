/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import Logo from './components/logo'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
import {CircleButton, Button} from './components/lib'
import {useAuth} from './context/auth-context'
import useCallbackStatus from './utils/use-callback-status'

function LoginForm({onSubmit, buttonText}) {
  const {isPending, isRejected, error, run} = useCallbackStatus()
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
    <form className="form__login-register" onSubmit={handleSubmit}>
      <div className="form__group">
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div className="form__group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <Button type="submit">
          {buttonText} {isPending ? '...' : null}
        </Button>
      </div>
      {isRejected ? (
        <div css={{color: 'red'}}>{error ? error.message : null}</div>
      ) : null}
    </form>
  )
}

function useUpdateEffect(effect, deps) {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (mounted.current) {
      effect()
    } else {
      mounted.current = true
    }
    // we're using it right, I promise...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

function Modal({button, children}) {
  const {clearError} = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  useUpdateEffect(() => {
    if (!isOpen) {
      clearError()
    }
  }, [isOpen])

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

function UnauthenticatedApp() {
  const {login, register} = useAuth()

  return (
    <div className="centered">
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div css={{display: 'flex'}}>
        <Modal button={<Button css={{marginRight: 6}}>Login</Button>}>
          <h3>Login</h3>
          <LoginForm onSubmit={login} buttonText="Login" />
        </Modal>
        <Modal button={<Button variant="secondary">Register</Button>}>
          <h3>Register</h3>
          <LoginForm onSubmit={register} buttonText="Register" />
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
