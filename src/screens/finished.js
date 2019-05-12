/** @jsx jsx */
import {jsx} from '@emotion/core'
import {BookListUL} from '../components/lib'
import {
  useListItemDispatch,
  useListItemState,
  removeListItem,
  updateListItem,
} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const dispatch = useListItemDispatch()
  const listItems = useListItemState()
  const unreadListItems = listItems.filter(li => li.finishDate)

  function handleRemoveClick(listItem) {
    return removeListItem(dispatch, listItem.id)
  }

  function handleMarkAsUnreadClick(listItem) {
    return updateListItem(dispatch, listItem.id, {finishDate: null})
  }

  return (
    <div css={{marginTop: '1em'}}>
      <BookListUL>
        {unreadListItems.map(listItem => (
          <li key={listItem.id}>
            <BookRow
              book={listItem.book}
              listItem={listItem}
              onRemoveClick={() => handleRemoveClick(listItem)}
              onMarkAsUneadClick={() => handleMarkAsUnreadClick(listItem)}
            />
          </li>
        ))}
      </BookListUL>
    </div>
  )
}

export default ReadingListScreen
