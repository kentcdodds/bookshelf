import React from 'react'
import {useListItemState} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const listItems = useListItemState()
  return (
    <div className="reading-list">
      <ul>
        {listItems.map(listItem => (
          <li key={listItem.id}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReadingListScreen
