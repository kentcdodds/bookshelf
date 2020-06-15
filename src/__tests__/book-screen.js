import React from 'react'
import {
  render,
  fireEvent,
  screen,
  waitForLoadingToFinish,
  act,
  userEvent,
  loginAsUser,
} from 'test/app-test-utils'
import faker from 'faker'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {server, rest} from 'test/server'
import {formatDate} from 'utils/misc'
import {apiURL} from 'utils/api-client'
import {App} from 'app'

async function renderBookScreen({user, book, listItem} = {}) {
  if (user === undefined) {
    user = await loginAsUser()
  }
  if (book === undefined) {
    book = await booksDB.create(buildBook())
  }
  if (listItem === undefined) {
    listItem = await listItemsDB.create(buildListItem({owner: user, book}))
  }
  const route = `/book/${book.id}`

  const utils = await render(<App />, {user, route})

  return {
    ...utils,
    book,
    user,
    listItem,
  }
}

test('renders all the book information', async () => {
  const {book} = await renderBookScreen({listItem: null})

  expect(screen.getByText(book.title)).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByLabelText(/add to list/i)).toBeInTheDocument()

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

  await waitForLoadingToFinish()

  expect(await screen.findByLabelText(/mark as read/i)).toBeInTheDocument()
  expect(await screen.findByLabelText(/remove from list/i)).toBeInTheDocument()
  expect(screen.queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/unmark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/1 star/i)).not.toBeInTheDocument()
  expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()))
})

test('can remove a list item for the book', async () => {
  await renderBookScreen()

  const removeFromListButton = screen.getByLabelText(/remove from list/i)
  userEvent.click(removeFromListButton)
  expect(removeFromListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByLabelText(/add to list/i)).toBeInTheDocument()

  expect(screen.queryByLabelText(/remove from list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as unread/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  const {listItem} = await renderBookScreen()

  // set the listItem to be unread in the DB
  const startDate = 1551052800000
  await listItemsDB.update(listItem.id, {finishDate: null, startDate})

  const markAsReadButton = screen.getByLabelText(/mark as read/i)
  userEvent.click(markAsReadButton)
  expect(markAsReadButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByLabelText(/unmark as read/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/remove from list/i)).toBeInTheDocument()

  expect(screen.queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/^mark as read/i)).not.toBeInTheDocument()
  expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  const startAndFinishNode = screen.getByLabelText(/start and finish date/i)
  expect(startAndFinishNode).toHaveTextContent(
    `${formatDate(startDate)} — ${formatDate(Date.now())}`,
  )
  expect(screen.getByLabelText(/1 star/i)).toBeInTheDocument()
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

  await waitForLoadingToFinish()
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
    const book = {id: 'BAD_ID'}
    await renderBookScreen({listItem: null, book})

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
    server.use(
      rest.put(`${apiURL}/list-items/:listItemId`, async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({status: 400, message: testErrorMessage}),
        )
      }),
    )

    // using fake timers to skip debounce time
    jest.useFakeTimers()
    userEvent.type(notesTextarea, newNotes)
    act(() => jest.runAllTimers())
    jest.useRealTimers()

    await waitForLoadingToFinish()
    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"There was an error: __test_error_message__"`,
    )
  })
})
