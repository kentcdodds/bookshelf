// 🐨 you'll need to import React and ReactDOM up here
import * as React from 'react';
import ReactDOM from 'react-dom';
// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo';
// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked
const App = () => {
    return (
        <div>
            <Logo />
            <h1>Bookshelf</h1>
            <div>
                <button onClick={()=>window.alert('Login button was clicked')}>Login</button>
            </div>
            <div>
                <button onClick={()=>window.alert('Register Button was clicked')}>Register</button>
            </div>
        </div>
    )
}
// 🐨 use ReactDOM to render the <App /> to the root element
ReactDOM.render(<App/>, document.getElementById('root'));
// 💰 find the root element with: document.getElementById('root')
