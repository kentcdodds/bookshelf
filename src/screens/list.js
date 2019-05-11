/** @jsx jsx */
import {jsx} from '@emotion/core'
import {useListItemState} from '../context/list-item-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const listItems = useListItemState()
  return (
    <div css={{marginTop: '1em'}}>
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
          display: 'grid',
          gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
          gridGap: '1em',
        }}
      >
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
