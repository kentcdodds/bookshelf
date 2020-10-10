import React from 'react'
import {render, screen, loginAsUser, waitFor} from 'test/app-test-utils'
import userEvent from '@testing-library/user-event'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {Rating} from '../rating'

async function renderRating({rating = 0} = {}) {
  const book = await booksDB.create(buildBook())
  const user = await loginAsUser()
  const listItem = await listItemsDB.create({
    ...buildListItem({owner: user, book}),
    rating,
  })
  const utils = await render(<Rating listItem={listItem} />, {user})
  return {...utils, book, user, listItem}
}

test('it updates the rating', async () => {
  const {listItem, rerender} = await renderRating()
  const firstStar = screen.getByLabelText('1 star')

  userEvent.click(firstStar)

  // needed because of react-query
  await waitFor(() => {})
  const updatedListItem = await listItemsDB.read(listItem.id)
  rerender(<Rating listItem={updatedListItem} />)
  expect(screen.getByLabelText('1 star')).toBeChecked()
})
