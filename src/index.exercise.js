// 🐨 you'll need to import react and createRoot from react-dom up here
const React = require('react-dom');
const createRoot = require('react-dom');

// 🐨 you'll also need to import the Logo component from './components/logo'
const Logo = require('./components/logo');
// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
function App() {
    return (
      <div>
        <Logo />
        <Title name="Bookshelf" />
        <Welcome name="Edite" />
        <Button onClick={Login}/>
        <Button onClick={Register}/>
        </div>
     
    );
  }
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// 🐨 use createRoot to render the <App /> to the root element
const root = ReactDOM.createRoot(container); 
root.render(<App  />);
// 💰 find the root element with: document.getElementById('root')
const container = document.getElementById('root');
