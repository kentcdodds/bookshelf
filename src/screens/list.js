import React from 'react'
import {useUser} from '../context/user-context'
import {useBookList} from '../context/books-context'
import BookRow from '../components/book-row'

function ReadingListScreen() {
  const {user} = useUser()
  const {books, error, isLoading} = useBookList(user.readingList)

  if (error) {
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

  return (
    <div className="reading-list">
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <BookRow book={book} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReadingListScreen
