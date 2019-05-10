import React from 'react'
import Tooltip from '@reach/tooltip'
import * as booksClient from '../utils/books'

function bookReducer(state, action) {
  switch (action.type) {
    case 'fetching': {
      return {...state, isLoading: true, error: null}
    }
    case 'success': {
      return {isLoading: false, error: null, books: action.books}
    }
    case 'error': {
      return {isLoading: false, error: action.error, books: state.books}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const initialState = {isLoading: false, error: null, books: []}

function DiscoverBooksScreen() {
  const queryRef = React.useRef()
  const [state, dispatch] = React.useReducer(bookReducer, initialState)
  const {books, isLoading, error} = state

  function handleSearchClick() {
    dispatch({type: 'fetching'})
    const query = queryRef.current.value
    booksClient
      .search(query)
      .then(
        matchingBooks => dispatch({type: 'success', books: matchingBooks}),
        error => dispatch({type: 'error', error}),
      )
  }

  return (
    <div>
      <div>
        <input ref={queryRef} id="search" />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button onClick={handleSearchClick}>
              <span role="img" aria-label="search">
                🔎
              </span>
            </button>
          </label>
        </Tooltip>
        {isLoading ? (
          <span role="img" aria-label="loading">
            🌀
          </span>
        ) : null}
        {error ? (
          <div>
            <span role="img" aria-label="error">
              🚨
            </span>
            There was an error
          </div>
        ) : null}
      </div>
      <div>
        {books.map(book => (
          <BookRow key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

function BookRow({book}) {
  return (
    <div>
      <img src={book.coverImageUrl} alt={`${book.title} cover`} />
      <pre>{JSON.stringify(book, null, 2)}</pre>
      <hr />
    </div>
  )
}

export default DiscoverBooksScreen
