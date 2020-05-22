import ReactDOM from 'react-dom'
import {waitForElementToBeRemoved, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {buildUser} from 'test/generate'

// this is a pretty comprehensive test and CI is pretty slow...
jest.setTimeout(25000)

test('can login and use the book search', async () => {
  // setup
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i), {
    timeout: 6000,
  })

  const user = buildUser()

  userEvent.click(screen.getByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  await userEvent.type(modal.getByLabelText(/username/i), user.username)
  await userEvent.type(modal.getByLabelText(/password/i), user.password)

  userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i), {
    timeout: 6000,
  })

  userEvent.click(screen.getAllByRole('link', {name: /discover/i})[0])

  const searchInput = screen.getByPlaceholderText(/search/i)
  await userEvent.type(searchInput, 'voice of war')

  userEvent.click(screen.getByLabelText(/search/i))
  await waitForElementToBeRemoved(() => screen.getAllByLabelText(/loading/i), {
    timeout: 6000,
  })

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
  ReactDOM.unmountComponentAtNode(root)
  document.body.removeChild(root)
})
