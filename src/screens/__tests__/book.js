import React from 'react'
import {queryCache} from 'react-query'
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
  act,
  userEvent,
} from 'test/app-test-utils'
import faker from 'faker'
import {buildUser, buildBook, buildListItem} from 'test/generate'
import * as listItemsClient from 'utils/list-items-client'
import {useListItem} from 'utils/list-items'
import {useBook} from 'utils/books'
import * as booksClient from 'utils/books-client'
import BookScreen from '../book'

jest.mock('context/auth-context')
jest.mock('utils/list-items-client')
jest.mock('utils/books-client')
jest.mock('utils/list-items')
jest.mock('utils/books')

async function renderBookScreen({
  user = buildUser(),
  bookId = faker.random.uuid(),
  book = buildBook({id: bookId}),
  listItem = buildListItem({owner: user, book}),
} = {}) {
  useListItem.mockReturnValue(listItem)
  useBook.mockReturnValue(book)

  const utils = render(<BookScreen bookId={book ? book.id : bookId} />)

  await waitForElementToBeRemoved(() =>
    utils.getByRole('heading', {name: 'Loading...'}),
  )

  return {
    ...utils,
    book,
    user,
    listItem,
  }
}

test('renders all the book information', async () => {
  const {book} = await renderBookScreen({listItem: null})

  screen.getByText(book.title)
  screen.getByText(book.author)
  screen.getByText(book.publisher)
  screen.getByText(book.synopsis)
  screen.getByLabelText(/add to list/i)

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/remove from list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as unread/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test.only('can create a list item for the book', async () => {
  const {user, book} = await renderBookScreen({listItem: null})
  const newListItem = buildListItem({
    owner: user,
    book,
    startDate: 1558045613440,
    finishDate: null,
  })
  listItemsClient.read.mockImplementation(() => ({
    listItems: [newListItem],
  }))

  listItemsClient.create.mockImplementationOnce(() => ({listItem: newListItem}))

  const addToListButton = screen.getByLabelText(/add to list/i)
  userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  expect(listItemsClient.create).toHaveBeenCalledWith({bookId: book.id})
  expect(listItemsClient.create).toHaveBeenCalledTimes(1)

  await waitForElementToBeRemoved(() =>
    within(addToListButton).getByLabelText(/loading/i),
  )

  await screen.findByLabelText(/mark as read/i)
  await screen.findByLabelText(/remove from list/i)
  expect(screen.queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/unmark as read/i)).not.toBeInTheDocument()
  screen.getByLabelText(/notes/i)
  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent('May 19')
  screen.getByLabelText(/1 star/i)
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

  const removeFromListButton = getByLabelText(/remove from list/i)
  fireEvent.click(removeFromListButton)
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
            ...body,
            finishDate: 1558045613440,
          }),
        }
      },
    }
  })

  const markAsReadButton = getByLabelText(/mark as read/i)
  fireEvent.click(markAsReadButton)
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

test('shows an error message when the book fails to load', async () => {
  const user = buildUser()

  bootstrapAppData.mockResolvedValueOnce({
    user,
    listItems: [],
  })

  const testError = '__test_error__'

  window.fetch.mockRejectedValueOnce({
    status: 500,
    message: testError,
  })

  const {getByLabelText, getByText} = render(<BookScreen bookId="some-id" />)

  await waitForElementToBeRemoved(() => getByLabelText(/loading/i))

  getByText(testError)
})

test('shows an error message when there is no book by the given id', async () => {
  const {getByText} = await renderBookScreen({book: null})
  getByText(/try another/i)
})

test('can edit a note', async () => {
  const {getByLabelText, listItem} = await renderBookScreen()

  const newNotes = faker.lorem.words()
  const notesTextarea = getByLabelText(/notes/i)

  window.fetch.mockImplementationOnce(async (url, config) => {
    expect(url).toMatch(new RegExp(`list-item/${listItem.id}`))
    expect(config.method).toBe('PUT')
    const body = JSON.parse(config.body)
    expect(body.notes).toEqual(newNotes)
    return {
      status: 200,
      async json() {
        return {
          listItem: {
            ...listItem,
            notes: newNotes,
          },
        }
      },
    }
  })

  // using fake timers to skip debounce time
  jest.useFakeTimers()
  fireEvent.change(notesTextarea, {target: {value: newNotes}})
  act(() => jest.runAllTimers())
  jest.useRealTimers()

  await waitForElementToBeRemoved(() => getByLabelText(/loading/i))
  expect(window.fetch).toHaveBeenCalledTimes(1)
  expect(notesTextarea.value).toBe(newNotes)
})

test('note update failures are displayed', async () => {
  const {getByLabelText, listItem, getByText} = await renderBookScreen()

  const newNotes = faker.lorem.words()
  const notesTextarea = getByLabelText(/notes/i)

  const testErrorMessage = '__test_error_message__'
  window.fetch.mockImplementationOnce(async (url, config) => {
    expect(url).toMatch(new RegExp(`list-item/${listItem.id}`))
    expect(config.method).toBe('PUT')
    const body = JSON.parse(config.body)
    expect(body.notes).toEqual(newNotes)
    return Promise.reject({
      status: 500,
      message: testErrorMessage,
    })
  })

  // using fake timers to skip debounce time
  jest.useFakeTimers()
  fireEvent.change(notesTextarea, {target: {value: newNotes}})
  act(() => jest.runAllTimers())
  jest.useRealTimers()

  await waitForElementToBeRemoved(() => getByLabelText(/loading/i))
  expect(window.fetch).toHaveBeenCalledTimes(1)
  getByText(testErrorMessage)
})
