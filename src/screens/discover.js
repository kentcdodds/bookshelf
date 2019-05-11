import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaPlus, FaSearch, FaMinus, FaBook} from 'react-icons/fa'
import VanillaTilt from 'vanilla-tilt'
import {useUserState} from '../context/user-context'
import * as booksClient from '../utils/books'
import {
  useListItemDispatch,
  useSingleListItemState,
} from '../context/list-item-context'

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

  // TODO: remove this
  React.useEffect(() => {
    queryRef.current.value = 'lord of the rings'
    handleSearchClick()
  }, [])

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
              <FaSearch aria-label="search" />
            </button>
          </label>
        </Tooltip>
        {isLoading ? (
          <span role="img" aria-label="loading">
            🌀
          </span>
        ) : null}
        {error ? (
          <div style={{color: 'red'}}>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
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

function useTilt(tiltRef) {
  React.useEffect(() => {
    const {current: tiltNode} = tiltRef
    const vanillaTiltOptions = {
      max: 15,
      speed: 300,
      glare: true,
      'max-glare': 0.5,
    }
    VanillaTilt.init(tiltNode, vanillaTiltOptions)
    return () => tiltNode.vanillaTilt.destroy()
  }, [tiltRef])
}

const noListItem = {
  isPending: false,
  isResolved: false,
  isRejected: false,
  error: null,
  data: null,
}

function BookRow({book}) {
  const imgRef = React.useRef()
  useTilt(imgRef)
  const {user} = useUserState()
  const readingListDispatch = useListItemDispatch()
  const {isPending, isRejected, isResolved, error, data: listItem} =
    useSingleListItemState({
      bookId: book.id,
    }) || noListItem
  console.log(book.id, {isPending, isRejected, isResolved, error, listItem})

  return (
    <div className="discover__row">
      <div className="discover__image">
        <img
          ref={imgRef}
          src={book.coverImageUrl}
          alt={`${book.title} cover`}
        />
        {isPending ? (
          <FaBook aria-label="loading" />
        ) : isResolved ? (
          <Tooltip label="Remove from Reading List">
            <button
              className="discover__add_button"
              onClick={() =>
                readingListDispatch({type: 'remove', listItemId: listItem.id})
              }
            >
              <FaMinus aria-label="remove" />
            </button>
          </Tooltip>
        ) : (
          <Tooltip label="Add to Reading List">
            <button
              className="discover__add_button"
              onClick={() =>
                readingListDispatch({
                  type: 'create',
                  ownerId: user.id,
                  bookId: book.id,
                })
              }
            >
              <FaPlus aria-label="add" />
            </button>
          </Tooltip>
        )}
        {isRejected ? (
          <div style={{color: 'red', overflow: 'scroll'}}>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        <h3>{book.title}</h3>
        <div className="author">
          <h4>{book.author}</h4>
        </div>
        <small>{book.publisher}</small>
        <small>{book.synopsis.substring(0, 500)}...</small>
      </div>
    </div>
  )
}

export default DiscoverBooksScreen
