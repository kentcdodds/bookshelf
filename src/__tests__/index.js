import ReactDOM from 'react-dom'
import {waitForElementToBeRemoved, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {buildUser} from 'test/generate'

beforeAll(() => {
  document.body.focus()
})

test('can login and use the book search', async () => {
  // setup
  const div = document.createElement('div')
  div.setAttribute('id', 'root')
  document.body.appendChild(div)
  require('../index')

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const user = buildUser()

  userEvent.click(screen.getByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  await userEvent.type(modal.getByLabelText(/username/i), user.username)
  await userEvent.type(modal.getByLabelText(/password/i), user.password)

  userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const discoverLink = screen.getAllByRole('link', {name: /discover/i})[0]
  discoverLink.focus()
  userEvent.click(discoverLink)

  const searchInput = screen.getByPlaceholderText(/search/i)
  await userEvent.type(searchInput, 'voice of war')

  userEvent.click(screen.getByLabelText(/search/i))
  await waitForElementToBeRemoved(() => screen.getAllByLabelText(/loading/i))

  userEvent.click(screen.getByText(/voice of war/i))

  expect(window.location.href).toMatchInlineSnapshot(
    `"http://localhost/book/B084F96GFZ"`,
  )

  expect(
    await screen.findByText(/to the west, a sheltered girl/i),
  ).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', {name: /logout/i}))

  expect(searchInput).not.toBeInTheDocument()

  // cleanup
  ReactDOM.unmountComponentAtNode(div)
  document.body.removeChild(div)
})
