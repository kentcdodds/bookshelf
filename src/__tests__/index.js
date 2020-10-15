import ReactDOM from 'react-dom'
import '@testing-library/jest-dom/extend-expect'
import {screen, waitForElementToBeRemoved, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import {server} from 'test/server'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// this is a pretty comprehensive test and CI is pretty slow...
jest.setTimeout(25000)

function buildUser(overrides) {
  return {
    id: faker.random.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 4000},
  )

test('can login and use the book search', async () => {
  // setup
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  await waitForLoadingToFinish()

  const user = buildUser()

  userEvent.click(screen.getByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  userEvent.type(modal.getByLabelText(/username/i), user.username)
  userEvent.type(modal.getByLabelText(/password/i), user.password)

  userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForLoadingToFinish()

  userEvent.click(screen.getAllByRole('link', {name: /discover/i})[0])

  const searchInput = screen.getByPlaceholderText(/search/i)
  userEvent.type(searchInput, 'voice of war{enter}')

  await waitForLoadingToFinish()

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
