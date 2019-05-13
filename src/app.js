/** @jsx jsx */
import {jsx} from '@emotion/core'

import styled from '@emotion/styled'
import React from 'react'
import Logo from './components/logo'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog} from '@reach/dialog'
import {CircleButton, Button, FormGroup, Centered} from './components/lib'
import * as authClient from './utils/auth-client'

// 💣 delete this eslint comment to see which variables are unused that you'll
// need to use for this exercise.
/* eslint no-unused-vars:0 */

// 💰 You can see the lint warnings in the console and you can install the
// ESLint plugin for your editor to see them inline.

function LoginForm({onSubmit, buttonText}) {
  function handleSubmit(event) {
    // 🦉 when a form is submitted in the browser, the default behavior is for
    // the browser to issue a POST request at the current URL. Which triggers
    // a full page refresh. We're going to make our own POST request using
    // window.fetch.
    // 🐨 make sure to not forget to prevent the default behavior
    // 🐨 get the username and password from the form elements
    // 💰 you can get the form elements from event.target.elements
    // 🐨 call onSubmit with an object that has the username and password values
    // 💯 as extra credit, try to handle errors here
    // 💯 try showing a loading indicator. You can use the <Spinner /> component
    // from './components/lib'.
  }

  return (
    // 🐨 add the onSubmit handler
    <form
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
      {/* 🐨 Use the FormGroup component to render the label and input for both the username and password */}
      {/* 💰 Should be structured like: <FormGroup><label /><input /></FormGroup> */}

      {/* 🐨 Render the <Button /> here with the buttonText */}
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
  // 🐨 store the user state here (I recommend React.useState(null))

  // 🐨 if there is a user then return "user.username is logged in" and a button
  // to log the user out. When the button is clicked, it sets the user state to
  // null and calls authClient.logout.

  // 🐨 define a login function here and pass it to the `onSubmit` handler of
  // the LoginForm.
  // 💰 it should call authClient.login with {username, password}. This returns
  // a promise which resolves to the user. So chain a `.then` and set the user.

  // 🐨 Do the same with a register function
  // 💰 this one will call authClient.register, but it's the same as login otherwise.

  return (
    <Centered>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div css={{display: 'flex'}}>
        <Modal button={<Button css={{marginRight: 6}}>Login</Button>}>
          <ModalTitle>Login</ModalTitle>
          <LoginForm buttonText="Login" />
        </Modal>
        <Modal button={<Button variant="secondary">Register</Button>}>
          <ModalTitle>Register</ModalTitle>
          <LoginForm buttonText="Register" />
        </Modal>
      </div>
    </Centered>
  )
}

// 💰 if you wanna see the finished version then comment out the next line
// and comment back in the last two lines
export default App
// const FinishedApp = require('./app.finished.js')
// export default FinishedApp.default
