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

  const user = buildUser()

  // for the extra credit
  const loading = screen.queryByLabelText(/loading/i)
  if (loading) {
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  }

  userEvent.click(screen.getByRole('button', {name: /register/i}))
  await userEvent.type(screen.getByLabelText(/username/i), user.username)
  await userEvent.type(screen.getByLabelText(/password/i), user.password)

  userEvent.click(screen.getByRole('button', {name: /register/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const searchInput = screen.getByPlaceholderText(/search/i)
  userEvent.type(searchInput, 'voice of war')

  const searchIcon = screen.getByLabelText(/search/i)
  searchIcon.closest('button').focus()
  userEvent.click(searchIcon)
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  expect(screen.getByText(/voice of war/i)).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', {name: /logout/i}))

  expect(searchInput).not.toBeInTheDocument()
})
