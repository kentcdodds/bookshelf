/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from '@reach/router'
import {BookListUL} from '../components/lib'
import {useListItemState} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const listItems = useListItemState()
  const readListItems = listItems.filter(li => li.finishDate)

  if (!listItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        <p>
          Hey there! This is where books will go when you've finished reading
          them. Get started by heading over to{' '}
          <Link to="/discover">the Discover page</Link> to add books to your
          list.
        </p>
      </div>
    )
  }
  if (!readListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        <p>
          Looks like you've got some reading to do! Check them out in your{' '}
          <Link to="/list">reading list</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      </div>
    )
  }

  return (
    <div css={{marginTop: '1em'}}>
      <BookListUL>
        {readListItems.map(listItem => (
          <li key={listItem.id}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </BookListUL>
    </div>
  )
}

export default ReadingListScreen
