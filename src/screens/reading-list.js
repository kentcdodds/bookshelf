import * as React from 'react'
import {Link} from 'components/lib'
import {ListItemList} from 'components/list-item-list'

function ReadingListScreen() {
  return (
    <ListItemList
      filterListItems={li => !li.finishDate}
      noListItems={
        <p>
          Hey there! Welcome to your bookshelf reading list. You can get started by
          heading over to <Link to="/discover">the Discover page</Link> to add
          books to your list.
        </p>
      }
      noFilteredListItems={
        <p>
          Congratulations! It appears you've conquered every page in your literary arsenal! Now, it's time to bask in the glory of your completed books. Check them out in your{' '}
          <Link to="/finished">finished books</Link> or{' '}
          <Link to="/discover">discover more</Link> books as you wish.
        </p>
      }
    />
  )
}

export {ReadingListScreen}
