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
        <input ref={queryRef} placeholder="Search books..." id="search" />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button className="button--search" onClick={handleSearchClick}>
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
        <br />
        {books.map(book => (
          <BookRow key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

function BookRow({book}) {
  return (
    <div className="discover__row">
      <div className="discover__image">
        <img src={book.coverImageUrl} alt={`${book.title} cover`} />
      </div>
      <div>
        <h3>{book.title}</h3>
        <div className="author">
          <h4>{book.author}</h4>
        </div>
        <small>{book.publisher}</small>
        <small>{book.synopsis.substring(0, 500)}...</small>
      </div>
      {/* <pre>{JSON.stringify(book, null, 2)}</pre> */}
    </div>
  )
}

export default DiscoverBooksScreen
