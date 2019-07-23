import React from 'react'
import {render, within} from '@testing-library/react'
import {buildListItem} from '../../../test/generate'
import ListItemList from '../../components/list-item-list'
import FinishedScreen from '../finished'

jest.mock('../../components/list-item-list')

afterEach(() => {
  ListItemList.mockClear()
})

function renderList() {
  const {getByTestId} = render(<FinishedScreen />)
  return {
    noListItems: within(getByTestId('no-list-items')),
    noFilteredListItems: within(getByTestId('no-filtered-list-items')),
  }
}

test('renders link to the discover page when there are no list items at all', () => {
  const {noListItems} = renderList()
  const discoverAnchor = noListItems.getByText(/discover/i, {selector: 'a'})
  expect(discoverAnchor).toHaveAttribute('href', '/discover')
})

test('renders link to the discover and list pages when there are list items', () => {
  const {noFilteredListItems} = renderList()
  const discoverAnchor = noFilteredListItems.getByText(/discover/i, {
    selector: 'a',
  })
  expect(discoverAnchor).toHaveAttribute('href', '/discover')
  const listAnchor = noFilteredListItems.getByText(/reading list/i, {
    selector: 'a',
  })
  expect(listAnchor).toHaveAttribute('href', '/list')
})

test('the given filter filters out unfinished books', () => {
  renderList()
  const {filterListItems} = ListItemList.mock.calls[0][0]
  const unreadListItem = buildListItem({finishDate: null})
  const readListItem = buildListItem({finishDate: Date.now()})
  expect(filterListItems(unreadListItem)).toBe(false)
  expect(filterListItems(readListItem)).toBe(true)
})
