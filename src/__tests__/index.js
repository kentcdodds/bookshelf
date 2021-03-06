import ReactDOM from 'react-dom'
import {screen} from '@testing-library/react'

test('renders the app', () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  screen.getByTitle('Bookshelf')
  screen.getByRole('heading', {name: /Bookshelf/i})
  screen.getByRole('button', {name: /Login/i})
  screen.getByRole('button', {name: /Register/i})

  // cleanup
  ReactDOM.unmountComponentAtNode(root)
  document.body.removeChild(root)
})
