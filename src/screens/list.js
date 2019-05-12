/** @jsx jsx */
import {jsx} from '@emotion/core'
import {BookListUL} from '../components/lib'
import {useListItemState} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const listItems = useListItemState()

  function handleRemoveClick(listItem) {
    console.log('TODO', listItem)
  }

  function handleMarkAsReadClick(listItem) {
    console.log('TODO', listItem)
  }

  return (
    <div css={{marginTop: '1em'}}>
      <BookListUL>
        {listItems.map(listItem => (
          <li key={listItem.id}>
            <BookRow
              book={listItem.book}
              listItem={listItem}
              onRemoveClick={() => handleRemoveClick(listItem)}
              onMarkAsReadClick={() => handleMarkAsReadClick(listItem)}
            />
          </li>
        ))}
      </BookListUL>
    </div>
  )
}

export default ReadingListScreen
