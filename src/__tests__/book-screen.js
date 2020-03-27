import React from 'react'
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
  act,
  userEvent,
  loginAsUser,
} from 'test/app-test-utils'
import faker from 'faker'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {formatDate} from 'utils/misc'
import {App} from '../app'

async function renderBookScreen({user, book, listItem, route} = {}) {
  if (user === undefined) {
    user = await loginAsUser()
  }
  if (book === undefined) {
    book = await booksDB.create(buildBook())
  }
  if (listItem === undefined) {
    listItem = await listItemsDB.create(buildListItem({owner: user, book}))
  }
  if (route === undefined) {
    route = `/book/${book.id}`
  }

  const utils = render(<App />, {route})

  await waitForElementToBeRemoved(
    () =>
      screen.queryByLabelText(/loading/i) ||
      screen.queryByRole('heading', {name: 'Loading...'}),
    {timeout: 4000},
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

test('can create a list item for the book', async () => {
  await renderBookScreen({listItem: null})

  const addToListButton = screen.getByLabelText(/add to list/i)
  userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForElementToBeRemoved(() =>
    within(addToListButton).getByLabelText(/loading/i),
  )

  await screen.findByLabelText(/mark as read/i)
  await screen.findByLabelText(/remove from list/i)
  expect(screen.queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/unmark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/1 star/i)).not.toBeInTheDocument()
  screen.getByLabelText(/notes/i)
  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()))
})

test('can remove a list item for the book', async () => {
  await renderBookScreen()

  const removeFromListButton = screen.getByLabelText(/remove from list/i)
  fireEvent.click(removeFromListButton)
  expect(removeFromListButton).toBeDisabled()

  await waitForElementToBeRemoved(() =>
    within(removeFromListButton).getByLabelText(/loading/i),
  )

  screen.getByLabelText(/add to list/i)

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/remove from list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as unread/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  const user = await loginAsUser()
  const book = await booksDB.create(buildBook())
  const startDate = 1551052800000
  const listItem = await listItemsDB.create(
    buildListItem({
      owner: user,
      book,
      finishDate: null,
      startDate,
    }),
  )
  await renderBookScreen({
    user,
    book,
    listItem,
  })

  const markAsReadButton = screen.getByLabelText(/mark as read/i)
  fireEvent.click(markAsReadButton)
  expect(markAsReadButton).toBeDisabled()

  await waitForElementToBeRemoved(() =>
    within(markAsReadButton).getByLabelText(/loading/i),
  )

  screen.getByLabelText(/unmark as read/i)
  screen.getByLabelText(/remove from list/i)

  expect(screen.queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/^mark as read/i)).not.toBeInTheDocument()
  screen.getByLabelText(/notes/i)
  const startAndFinishNode = screen.getByLabelText(/start and finish date/i)
  expect(startAndFinishNode).toHaveTextContent(
    `${formatDate(startDate)} — ${formatDate(Date.now())}`,
  )
  screen.getByLabelText(/1 star/i)
})

test('can edit a note', async () => {
  const {listItem} = await renderBookScreen()

  const newNotes = faker.lorem.words()
  const notesTextarea = screen.getByLabelText(/notes/i)

  // using fake timers to skip debounce time
  jest.useFakeTimers()
  fireEvent.change(notesTextarea, {target: {value: newNotes}})
  act(() => jest.runAllTimers())
  jest.useRealTimers()

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  expect(notesTextarea.value).toBe(newNotes)

  expect(listItemsDB.read(listItem.id)).toMatchObject({
    notes: newNotes,
  })
})

describe('console errors', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  test('shows an error message when the book fails to load', async () => {
    const testError = '__test_error__'

    window.fetch.mockRejectedValue({
      status: 500,
      message: testError,
    })
    await renderBookScreen()

    expect(
      (await screen.findByRole('alert')).textContent,
    ).toMatchInlineSnapshot(`"There was an error: __test_error__"`)
    expect(console.error).toHaveBeenCalled()
  })

  test('shows an error message when the book fails to load', async () => {
    await renderBookScreen({route: '/book/BAD_ID'})

    expect(
      (await screen.findByRole('alert')).textContent,
    ).toMatchInlineSnapshot(`"There was an error: Book not found"`)
    expect(console.error).toHaveBeenCalled()
  })

  test('note update failures are displayed', async () => {
    await renderBookScreen()

    const newNotes = faker.lorem.words()
    const notesTextarea = screen.getByLabelText(/notes/i)

    const testErrorMessage = '__test_error_message__'
    window.fetch.mockRejectedValue({
      status: 500,
      message: testErrorMessage,
    })

    // using fake timers to skip debounce time
    jest.useFakeTimers()
    fireEvent.change(notesTextarea, {target: {value: newNotes}})
    act(() => jest.runAllTimers())
    jest.useRealTimers()

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"There was an error: __test_error_message__"`,
    )
  })
})
