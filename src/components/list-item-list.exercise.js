/** @jsx jsx */
import {jsx} from '@emotion/core'

// 🐨 you'll need useQuery from 'react-query'
// 🐨 and client from 'utils/api-client'
import {BookListUL} from './lib'
import {BookRow} from './book-row'

function ListItemList({
  user,
  filterListItems,
  noListItems,
  noFilteredListItems,
}) {
  // 🐨 call useQuery to get the list-items from the 'list-items' endpoint
  // queryKey should be 'list-items'
  // queryFn should call the 'list-items' endpoint

  // 🐨 assign this to the list items you get back from react-query
  const listItems = null

  const filteredListItems = listItems?.filter(filterListItems)

  if (!listItems?.length) {
    return <div css={{marginTop: '1em', fontSize: '1.2em'}}>{noListItems}</div>
  }
  if (!filteredListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        {noFilteredListItems}
      </div>
    )
  }

  return (
    <BookListUL>
      {filteredListItems.map(listItem => (
        <li key={listItem.id}>
          <BookRow user={user} book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  )
}

export {ListItemList}
