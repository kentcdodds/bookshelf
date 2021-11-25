import "@reach/dialog/styles.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Dialog } from "@reach/dialog";
import { Logo } from "components/logo";

const LoginForm = ({ onSubmit, buttonText }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = event.target.elements;

    onSubmit({
      username: username.value,
      password: password.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  );
};

export default LoginForm;

const App = () => {
  const [openModal, setOpenModal] = useState("none");

  const login = (formData) => {
    console.log("login", formData);
  };

  const register = (formData) => {
    console.log("register", formData);
  };

  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={() => setOpenModal("login")}>Login</button>
      <button onClick={() => setOpenModal("register")}>Register</button>
      <Dialog aria-label="Login form" isOpen={openModal === "login"}>
        <div>
          <button onClick={() => setOpenModal("none")}>Close</button>
        </div>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openModal === "register"}>
        <div>
          <button onClick={() => setOpenModal("none")}>Close</button>
        </div>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
