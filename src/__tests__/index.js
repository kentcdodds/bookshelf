import {screen, waitForElementToBeRemoved, userEvent} from 'test/app-test-utils'
import {buildUser} from 'test/generate'

beforeAll(() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)
  document.body.focus()
})

test('can login and use the book search', async () => {
  require('../index')

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const user = buildUser()

  userEvent.click(screen.getByRole('button', {name: /register/i}))
  await userEvent.type(screen.getByLabelText(/username/i), user.username)
  await userEvent.type(screen.getByLabelText(/password/i), user.password)

  userEvent.click(screen.getByRole('button', {name: /register/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const discoverLink = screen.getByText(/discover/i)
  discoverLink.focus()
  userEvent.click(discoverLink)

  const searchInput = screen.getByPlaceholderText(/search/i)
  await userEvent.type(searchInput, 'voice of war')

  const searchIcon = screen.getByLabelText(/search/i)
  searchIcon.closest('button').focus()
  userEvent.click(searchIcon)
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  userEvent.click(screen.getByText(/voice of war/i))

  expect(window.location.href).toMatchInlineSnapshot(
    `"http://localhost/book/B084F96GFZ"`,
  )

  expect(
    await screen.findByText(/to the west, a sheltered girl/i),
  ).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', {name: /logout/i}))

  expect(searchInput).not.toBeInTheDocument()
})
