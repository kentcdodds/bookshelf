/** @jsx jsx */
import {jsx} from '@emotion/core'
import {BookListUL} from '../components/lib'
import {useListItemState} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const listItems = useListItemState()
  const unreadListItems = listItems.filter(li => li.finishDate)

  return (
    <div css={{marginTop: '1em'}}>
      <BookListUL>
        {unreadListItems.map(listItem => (
          <li key={listItem.id}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </BookListUL>
    </div>
  )
}

export default ReadingListScreen
