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
  // setup
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  let rootRef
  act(() => {
    rootRef = require('..').rootRef
  })

  await waitForLoadingToFinish()

  const user = buildUser()

  await userEvent.click(screen.getByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  await userEvent.type(modal.getByLabelText(/username/i), user.username)
  await userEvent.type(modal.getByLabelText(/password/i), user.password)

  await userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForLoadingToFinish()

  await userEvent.click(screen.getAllByRole('link', {name: /discover/i})[0])

  const searchInput = screen.getByPlaceholderText(/search/i)
  await userEvent.type(searchInput, 'voice of war{enter}')

  await waitForLoadingToFinish()

  await userEvent.click(screen.getByText(/voice of war/i))

  expect(window.location.href).toMatchInlineSnapshot(
    `"http://localhost/book/B084F96GFZ"`,
  )

  expect(
    await screen.findByText(/to the west, a sheltered girl/i),
  ).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', {name: /logout/i}))

  expect(searchInput).not.toBeInTheDocument()

  // cleanup
  act(() => rootRef.current.unmount())
  document.body.removeChild(root)
})
