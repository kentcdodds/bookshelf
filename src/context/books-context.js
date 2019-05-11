import React from 'react'
import * as booksClient from '../utils/books'

const BooksContext = React.createContext()

function booksReducer(state, action) {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        bookIdsRequesting: state.bookIdsToRequest,
        bookIdsToRequest: [],
        isLoading: true,
      }
    }
    case 'load books': {
      const cachedBookIds = action.bypassCache ? [] : Object.keys(state.books)
      // filter out those already cached or those which are currently being requested
      const bookIdsToRequest = action.bookIds.filter(
        id =>
          !cachedBookIds.includes(id) && !state.bookIdsRequesting.includes(id),
      )
      return {...state, bookIdsToRequest}
    }
    case 'success': {
      const books = action.books.reduce((all, newBook) => {
        all[newBook.id] = newBook
        return all
      }, state.books)

      return {
        ...state,
        isLoading: false,
        bookIdsToRequest: state.bookIdsToRequest.filter(id => !books[id]),
        books,
        error: null,
      }
    }
    case 'error': {
      return {...state, isLoading: false, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const initialState = {
  isLoading: false,
  books: {},
  error: null,
  bookIdsToRequest: [],
  bookIdsRequesting: [],
}

function useBooksContextValue() {
  const [state, dispatch] = React.useReducer(booksReducer, initialState)
  const {isLoading, books, error, bookIdsToRequest} = state
  React.useDebugValue(isLoading ? 'loading' : {error} || {books})
  console.log(books)

  React.useEffect(() => {
    if (bookIdsToRequest.length) {
      dispatch({type: 'loading'})
      booksClient.getBooks(bookIdsToRequest).then(
        retrievedBooks => {
          dispatch({type: 'success', books: retrievedBooks})
        },
        err => {
          dispatch({type: 'error', error: err})
        },
      )
    }
  }, [bookIdsToRequest])

  const value = React.useMemo(() => {
    return {
      books,
      error,
      isLoading,
      dispatch,
    }
  }, [books, error, isLoading])
  return value
}

function BooksProvider(props) {
  const value = useBooksContextValue()
  return <BooksContext.Provider value={value} {...props} />
}

function useBooks() {
  const context = React.useContext(BooksContext)
  if (!context) {
    throw new Error('useBooks must be used within an BooksProvider')
  }
  return context
}

function useBookList(bookIds) {
  const {books: allBooks, dispatch, error} = useBooks()
  const books = bookIds.map(bookId => allBooks[bookId])
  const allBooksLoaded = books.every(Boolean)

  React.useEffect(() => {
    if (!allBooksLoaded) {
      dispatch({type: 'load books', bookIds})
    }
  }, [allBooksLoaded, bookIds, dispatch])

  return {
    books,
    isLoading: !allBooksLoaded,
    error,
  }
}

export {BooksProvider, useBooks, useBookList}
