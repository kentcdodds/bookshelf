import React from 'react'
import Logo from './components/logo'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
import {useUserState, useUserDispatch} from './context/user-context'

function LoginForm({onSubmit, buttonText}) {
  const {isLoading, error} = useUserState()
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements
    onSubmit({
      username: username.value,
      password: password.value,
    })
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
        <button type="submit" className="button">
          {buttonText} {isLoading ? '...' : null}
        </button>
      </div>
      <div style={{color: 'red'}}>{error ? error.message : null}</div>
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

function Modal({buttonText, children}) {
  const dispatch = useUserDispatch()
  const [isOpen, setIsOpen] = React.useState(false)

  useUpdateEffect(() => {
    if (!isOpen) {
      dispatch({type: 'clear error'})
    }
  }, [isOpen])

  return (
    <>
      <button onClick={() => setIsOpen(true)}>{buttonText}</button>
      <Dialog isOpen={isOpen}>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button className="button--circle" onClick={() => setIsOpen(false)}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
        </div>
        {children}
      </Dialog>
    </>
  )
}

function UnauthenticatedApp() {
  const dispatch = useUserDispatch()

  return (
    <div className="centered">
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div className="landing">
        <Modal buttonText="Login">
          <h3>Login</h3>
          <LoginForm
            onSubmit={({username, password}) =>
              dispatch({type: 'authenticate', username, password})
            }
            buttonText="Login"
          />
        </Modal>
        <Modal buttonText="Register">
          <h3>Register</h3>
          <LoginForm
            onSubmit={({username, password}) =>
              dispatch({type: 'register', username, password})
            }
            buttonText="Register"
          />
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
