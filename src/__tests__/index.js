import '@testing-library/jest-dom/extend-expect'
import {
  screen,
  waitForElementToBeRemoved,
  within,
  act,
} from '@testing-library/react'
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
    id: faker.datatype.uuid(),
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

  let rootRef
  act(() => {
    rootRef = require('..').rootRef
  })

  const user = buildUser()

  await userEvent.click(await screen.findByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  await userEvent.type(modal.getByLabelText(/username/i), user.username)
  await userEvent.type(modal.getByLabelText(/password/i), user.password)

  await userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForLoadingToFinish()

  await userEvent.click(screen.getByRole('button', {name: /logout/i}))

  // cleanup
  act(() => rootRef.current.unmount())
  document.body.removeChild(root)
})
