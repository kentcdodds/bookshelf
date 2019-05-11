import React from 'react'
import {useAsync} from 'react-async'
import * as listItemsClient from '../utils/list-items'
import {useUserState} from '../context/user-context'
import BookRow from '../components/book-row'

const loadReadingList = ({readingList}) => listItemsClient.read(readingList)

function ReadingListScreen() {
  const {user} = useUserState()
  const {data, isLoading, error, isResolved, isRejected} = useAsync({
    promiseFn: loadReadingList,
    readingList: user.readingList,
  })

  if (isRejected) {
    return (
      <div style={{color: 'red'}}>
        <p>There was an error:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (isLoading) {
    return '...'
  }

  if (isResolved) {
    console.log(data)
    return (
      <div className="reading-list">
        <ul>
          {data.map(listItem => (
            <li key={listItem.id}>
              <BookRow book={listItem.book} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default ReadingListScreen
