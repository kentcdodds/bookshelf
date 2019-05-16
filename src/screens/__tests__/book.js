import React from 'react'
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  within,
} from 'react-testing-library'
import {buildUser, buildBook, buildListItem} from '../../../test/generate'
import {bootstrapAppData} from '../../utils/bootstrap'
import {AuthProvider} from '../../context/auth-context'
import {UserProvider} from '../../context/user-context'
import {ListItemProvider} from '../../context/list-item-context'
import BookScreen from '../book'

jest.mock('../../utils/bootstrap')

async function renderBookScreen({
  user = buildUser(),
  book = buildBook(),
  listItem = buildListItem({owner: user, book}),
} = {}) {
  bootstrapAppData.mockResolvedValueOnce({
    user,
    listItems: [listItem].filter(Boolean),
  })
  window.fetch.mockResolvedValueOnce({
    status: 200,
    async json() {
      return {
        book: book,
      }
    },
  })

  const utils = render(
    <AuthProvider>
      <UserProvider>
        <ListItemProvider>
          <BookScreen bookId={book.id} />
        </ListItemProvider>
      </UserProvider>
    </AuthProvider>,
  )

  await waitForElementToBeRemoved(() => utils.queryByLabelText(/loading/i))

  return {
    ...utils,
    book,
    user,
    listItem,
  }
}

test('renders all the book information', async () => {
  const {
    queryByLabelText,
    getByText,
    getByLabelText,
    book,
  } = await renderBookScreen({listItem: null})

  getByText(book.title)
  getByText(book.author)
  getByText(book.publisher)
  getByText(book.synopsis)
  getByLabelText(/add to list/i)

  expect(queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/remove from list/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/mark as read/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/mark as unread/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/notes/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can create a list item for the book', async () => {
  const {getByLabelText, queryByLabelText, user, book} = await renderBookScreen(
    {listItem: null},
  )

  window.fetch.mockImplementationOnce(async (url, config) => {
    expect(url).toMatch(/list-item/)
    expect(config.method).toBe('POST')
    const body = JSON.parse(config.body)
    expect(body).toEqual({ownerId: user.id, bookId: book.id})
    return {
      status: 200,
      async json() {
        return {
          listItem: buildListItem({
            book,
            startDate: 1558045613440,
            finishDate: null,
            ...body,
          }),
        }
      },
    }
  })

  const addToListButton = getByLabelText(/add to list/i).querySelector('button')
  fireEvent.click(addToListButton)
  within(addToListButton).getByLabelText(/loading/i)
  expect(addToListButton).toBeDisabled()

  await waitForElementToBeRemoved(() =>
    within(addToListButton).getByLabelText(/loading/i),
  )

  getByLabelText(/mark as read/i)
  getByLabelText(/remove from list/i)
  expect(queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/unmark as read/i)).not.toBeInTheDocument()
  getByLabelText(/notes/i)
  const startDateNode = getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent('May 19')
  getByLabelText(/1 star/i)
})

test('can remove a list item for the book', async () => {
  const {getByLabelText, queryByLabelText, listItem} = await renderBookScreen()

  window.fetch.mockImplementationOnce(async (url, config) => {
    expect(url).toMatch(/list-item/)
    expect(url.endsWith(listItem.id)).toBe(true)
    expect(config.method).toBe('DELETE')
    return {
      status: 200,
      async json() {
        return {success: true}
      },
    }
  })

  const removeFromListButton = getByLabelText(
    /remove from list/i,
  ).querySelector('button')
  fireEvent.click(removeFromListButton)
  within(removeFromListButton).getByLabelText(/loading/i)
  expect(removeFromListButton).toBeDisabled()

  await waitForElementToBeRemoved(() =>
    within(removeFromListButton).getByLabelText(/loading/i),
  )

  getByLabelText(/add to list/i)

  expect(queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/remove from list/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/mark as read/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/mark as unread/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/notes/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({
    owner: user,
    book,
    finishDate: null,
    startDate: 1551052800000,
  })
  const {getByLabelText, queryByLabelText} = await renderBookScreen({
    user,
    book,
    listItem,
  })

  window.fetch.mockImplementationOnce(async (url, config) => {
    expect(url).toMatch(/list-item/)
    expect(config.method).toBe('PUT')
    const body = JSON.parse(config.body)
    expect(body.finishDate).toEqual(expect.any(Number))
    return {
      status: 200,
      async json() {
        return {
          listItem: buildListItem({
            ...listItem,
            finishDate: 1558045613440,
            ...body,
          }),
        }
      },
    }
  })

  const markAsReadButton = getByLabelText(/mark as read/i).querySelector(
    'button',
  )
  fireEvent.click(markAsReadButton)
  within(markAsReadButton).getByLabelText(/loading/i)
  expect(markAsReadButton).toBeDisabled()

  await waitForElementToBeRemoved(() =>
    within(markAsReadButton).getByLabelText(/loading/i),
  )

  getByLabelText(/unmark as read/i)
  getByLabelText(/remove from list/i)
  expect(queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/^mark as read/i)).not.toBeInTheDocument()
  getByLabelText(/notes/i)
  const startAndFinishNode = getByLabelText(/start and finish date/i)
  expect(startAndFinishNode).toHaveTextContent(/Feb 19 .* May 19/)
  getByLabelText(/1 star/i)
})
