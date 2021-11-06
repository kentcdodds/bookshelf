import React from 'react';
import ReactDom from 'react-dom';
import { Logo } from './components/logo';
import { Dialog } from '@reach/dialog';

import "@reach/dialog/styles.css";

const LoginForm = ({ onSubmitHandler, buttonText }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const {username, password} = event.target.elements
    onSubmitHandler({
      username: username.value,
      password: password.value
    })
  }
    return (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id='username' placeholder='Username' />
          </div>
          <div>
            <label htmlFor='password'>Password:</label>
            <input type="password" id='password' placeholder='Password' />
          </div>
            <button>{buttonText}</button>
        </form>
    )
}

const App = () => {
    const [openModal, setOpenModal] = React.useState('none');
    const onLoginHandler = () => setOpenModal('login');
    const onRegisterHandler = () => setOpenModal('register');
    const closeModal = () => setOpenModal('none');

    const login = (formData) => {
      console.log(formData)
    };

    const register = (formData) => {
      console.log(formData)
    }

    return (
        <div>
            <Logo />

            <div>
              <button onClick={onLoginHandler}>Login</button>
            </div>
            <div>
              <button onClick={onRegisterHandler}>Register</button>
            </div>

            <Dialog aria-label='Login form' isOpen={openModal === 'login'} onDismiss={closeModal}>
                <h2>Login</h2>
                <LoginForm onSubmitHandler={login} buttonText='Login!'/>
            </Dialog>
            <Dialog aria-label='Registration form' isOpen={openModal === 'register'} onDismiss={closeModal}>
              <h2>Register</h2>
              <LoginForm onSubmitHandler={register} buttonText='Register!'/>
            </Dialog>
        </div>
    )
}

ReactDom.render(<App />, document.getElementById('root'))
