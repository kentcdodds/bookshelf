import '@testing-library/jest-dom/extend-expect'
import {screen, waitForElementToBeRemoved, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {server} from 'test/server'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// this is a pretty comprehensive test and CI is pretty slow...
jest.setTimeout(25000)

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 4000},
  )

test('renders the app', async () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  let rootRef
  act(() => {
    rootRef = require('..').rootRef
  })

  await userEvent.type(screen.getByPlaceholderText(/search/i), 'voice of war')
  await userEvent.click(screen.getByLabelText(/search/i))

  await waitForLoadingToFinish()

  expect(screen.getByText(/voice of war/i)).toBeInTheDocument()

  // cleanup
  act(() => rootRef.current.unmount())
  document.body.removeChild(root)
})
