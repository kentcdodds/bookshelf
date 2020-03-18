import React from 'react'
import {useQuery} from 'react-query'
import * as listItemsClient from '../utils/list-items-client'
import {BookListUL} from './lib'
import BookRow from './book-row'

function useListItems() {
  const {data: listItems} = useQuery('list-items', () =>
    listItemsClient.read().then(d => d.listItems),
  )
  return listItems ?? []
}

function ListItemList({filterListItems, noListItems, noFilteredListItems}) {
  const listItems = useListItems()

  const filteredListItems = listItems.filter(filterListItems)

  if (!listItems.length) {
    return <div className="text-lg">{noListItems}</div>
  }
  if (!filteredListItems.length) {
    return <div className="text-lg">{noFilteredListItems}</div>
  }

  return (
    <BookListUL>
      {filteredListItems.map(listItem => (
        <li key={listItem.id}>
          <BookRow book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  )
}

export default ListItemList
