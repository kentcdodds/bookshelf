/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from '@reach/router'
import {BookListUL} from '../components/lib'
import {useListItemState} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const listItems = useListItemState()
  const unreadListItems = listItems.filter(li => !li.finishDate)

  if (!listItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        <p>
          Hey there! Welcome to your bookshelf reading list. Get started by
          heading over to <Link to="/discover">the Discover page</Link> to add
          books to your list.
        </p>
      </div>
    )
  }
  if (!unreadListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        <p>
          Looks like you've finished all your books! Check them out in your{' '}
          <Link to="/finished">finished books</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      </div>
    )
  }

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
