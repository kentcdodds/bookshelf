import {within, waitForElementToBeRemoved} from 'react-testing-library'
import ReactDOM from 'react-dom'

// mock out hacks because that's basically the backend and we don't really
// want the backend running in our tests because that's not how a real app is
// tested (for unit/integration level tests).
jest.mock('../hacks')

test('booting up the app from the index file does not break anything', async () => {
  // setup
  const div = document.createElement('div')
  div.setAttribute('id', 'root')
  document.body.appendChild(div)

  // run the file and wait for things to settle.
  require('..')
  const {getByLabelText} = within(document.body)
  await waitForElementToBeRemoved(() => getByLabelText(/loading/i))

  // cleanup
  ReactDOM.unmountComponentAtNode(div)
  document.body.removeChild(div)
})
