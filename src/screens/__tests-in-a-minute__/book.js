import React from 'react'
import {render, fireEvent, waitForElement} from 'react-testing-library'
import {buildUser, buildListItem, buildBook} from '../../../test/generate'
import {bootstrapAppData} from '../../utils/bootstrap'
import {AuthProvider} from '../../context/auth-context'
import {UserProvider} from '../../context/user-context'
import {ListItemProvider} from '../../context/list-item-context'
import BookScreen from '../book'

jest.mock('../../utils/bootstrap', () => {
  return {
    bootstrapAppData: jest.fn(() => {
      console.error('Must provide a mock implementation to bootstrapAppData')
    }),
  }
})

beforeEach(() => {
  jest.spyOn(window, 'fetch').mockImplementation((...args) => {
    console.warn('window.fetch is not mocked for this call', ...args)
    return Promise.reject(new Error('This must be mocked!'))
  })
})

afterEach(() => {
  window.fetch.mockRestore()
})

test('updates highlighted stars onMouseOver and restores onMouseOut', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({book, ownerId: user.id, rating: -1})

  bootstrapAppData.mockResolvedValueOnce({
    user,
    listItems: [listItem],
  })

  const {findByLabelText} = render(
    <AuthProvider>
      <UserProvider>
        <ListItemProvider>
          <BookScreen bookId={book.id} />
        </ListItemProvider>
      </UserProvider>
    </AuthProvider>,
  )

  const oneStar = await findByLabelText(/1 star/i)

  window.fetch.mockResolvedValueOnce({
    status: 200,
    async json() {
      return {
        listItem: {
          ...listItem,
          rating: 1,
        },
      }
    },
  })

  // using fake timers to skip debounce time
  jest.useFakeTimers()
  fireEvent.click(oneStar)
  expect(oneStar.checked).toBe(true)
  jest.runAllTimers()
  jest.useRealTimers()

  await waitForElement(
    () => {
      return oneStar.checked ? oneStar : null
    },
    {timeout: 200},
  )
})
