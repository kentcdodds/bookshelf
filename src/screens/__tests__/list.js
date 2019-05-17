import React from 'react'
import {render, within} from 'react-testing-library'
import {buildListItem} from '../../../test/generate'
import ListItemList from '../../components/list-item-list'
import ListScreen from '../list'

jest.mock('../../components/list-item-list')

afterEach(() => {
  ListItemList.mockClear()
})

function renderList() {
  const {getByTestId} = render(<ListScreen />)
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

test('renders link to the discover and finished pages when there are finished list items', () => {
  const {noFilteredListItems} = renderList()
  const discoverAnchor = noFilteredListItems.getByText(/discover/i, {
    selector: 'a',
  })
  expect(discoverAnchor).toHaveAttribute('href', '/discover')
  const finishedAnchor = noFilteredListItems.getByText(/finished/i, {
    selector: 'a',
  })
  expect(finishedAnchor).toHaveAttribute('href', '/finished')
})

test('the given filter filters out finished books', () => {
  renderList()
  const {filterListItems} = ListItemList.mock.calls[0][0]
  const unreadListItem = buildListItem({finishDate: null})
  const readListItem = buildListItem({finishDate: Date.now()})
  expect(filterListItems(unreadListItem)).toBe(true)
  expect(filterListItems(readListItem)).toBe(false)
})
