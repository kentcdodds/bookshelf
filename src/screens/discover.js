import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaPlus, FaTimes, FaSearch, FaMinus, FaBook} from 'react-icons/fa'
import VanillaTilt from 'vanilla-tilt'
import {useAsync} from 'react-async'
import {useUser} from '../context/user-context'
import * as userClient from '../utils/user'
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

function BookSpinner() {
  return <FaBook aria-label="loading" />
}

function ToggleBookButton({bookId, tooltipLabel, icon, deferFn}) {
  const {updateUser} = useUser()
  const {isPending, setError, error, run} = useAsync({
    deferFn: () => deferFn(bookId).then(updatedUser => updateUser(updatedUser)),
  })

  function handleButtonClick() {
    if (error) {
      setError(null)
    } else {
      run()
    }
  }

  return (
    <>
      <Tooltip label={error ? 'Click to try again' : tooltipLabel}>
        <button className="discover__add_button" onClick={handleButtonClick}>
          {error ? (
            <FaTimes aria-label="error" />
          ) : isPending ? (
            <BookSpinner />
          ) : (
            icon
          )}
        </button>
      </Tooltip>
      {error ? <div style={{color: 'red'}}>There was an error.</div> : null}
    </>
  )
}

function BookRow({book}) {
  const imgRef = React.useRef()
  useTilt(imgRef)
  const {user} = useUser()
  const bookIsInReadingList = user.readingList.includes(book.id)

  return (
    <div className="discover__row">
      <div className="discover__image">
        <img
          ref={imgRef}
          src={book.coverImageUrl}
          alt={`${book.title} cover`}
        />
        {bookIsInReadingList ? (
          <ToggleBookButton
            bookId={book.id}
            tooltipLabel="Remove from Reading List"
            icon={<FaMinus aria-label="remove" />}
            deferFn={userClient.removeBookFromReadingList}
          />
        ) : (
          <ToggleBookButton
            bookId={book.id}
            tooltipLabel="Add to Reading List"
            icon={<FaPlus aria-label="add" />}
            deferFn={userClient.addBookToReadingList}
          />
        )}
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
