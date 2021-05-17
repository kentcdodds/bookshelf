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
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  const user = buildUser()

  userEvent.click(await screen.findByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  userEvent.type(modal.getByLabelText(/username/i), user.username)
  userEvent.type(modal.getByLabelText(/password/i), user.password)

  userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForLoadingToFinish()

  userEvent.click(screen.getByRole('button', {name: /logout/i}))

  // cleanup
  ReactDOM.unmountComponentAtNode(root)
  document.body.removeChild(root)
})
