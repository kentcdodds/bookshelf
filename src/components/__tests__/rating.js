import * as React from 'react'
import {render, screen, waitFor, loginAsUser} from 'test/app-test-utils'
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
  const {listItem} = await renderRating()
  const firstStar = screen.getByLabelText('1 star')

  userEvent.click(firstStar)

  await waitFor(async () => {
    const updatedListItem = await listItemsDB.read(listItem.id)
    expect(updatedListItem.rating).toBe(1)
  })
})

test(`it shows the correct rating for 0 stars`, async () => {
  await renderRating()

  expect(screen.getByLabelText('1 star')).not.toBeChecked()
  expect(screen.getByLabelText('2 stars')).not.toBeChecked()
  expect(screen.getByLabelText('3 stars')).not.toBeChecked()
  expect(screen.getByLabelText('4 stars')).not.toBeChecked()
  expect(screen.getByLabelText('5 stars')).not.toBeChecked()
})

test.each`
  rating | selectedLabel
  ${1}   | ${'1 star'}
  ${2}   | ${'2 stars'}
  ${3}   | ${'3 stars'}
  ${4}   | ${'4 stars'}
  ${5}   | ${'5 stars'}
`(
  `it shows the correct rating for $selectedLabel`,
  async ({rating, selectedLabel}) => {
    await renderRating({rating})

    expect(screen.getByLabelText(selectedLabel)).toBeChecked()
  },
)
