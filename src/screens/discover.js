import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaPlus, FaSearch, FaMinus, FaBook} from 'react-icons/fa'
import VanillaTilt from 'vanilla-tilt'
import {useAsync} from 'react-async'
import {useUser} from '../context/user-context'
import * as booksClient from '../utils/books'
import {
  useListItemDispatch,
  useSingleListItemState,
  addListItem,
  removeListItem,
} from '../context/list-item-context'

function DiscoverBooksScreen() {
  const queryRef = React.useRef()
  const {data: books, isPending, isRejected, error, run} = useAsync({
    deferFn: booksClient.search,
    initialValue: [],
  })

  function handleSearchClick(e) {
    e.preventDefault()
    run(queryRef.current.value)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <input ref={queryRef} placeholder="Search books..." id="search" />
          <Tooltip label="Search Books">
            <label htmlFor="search">
              <button type="submit" className="button--search">
                <FaSearch aria-label="search" />
              </button>
            </label>
          </Tooltip>
        </form>

        {isPending ? (
          <span role="img" aria-label="loading">
            🌀
          </span>
        ) : null}

        {isRejected ? (
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

function toggleListItem(event, {dispatch, user, book, listItem}) {
  if (listItem) {
    return removeListItem(dispatch, listItem.id)
  } else {
    return addListItem(dispatch, {ownerId: user.id, bookId: book.id})
  }
}

function BookRow({book}) {
  const imgRef = React.useRef()
  useTilt(imgRef)
  const user = useUser()
  const readingListDispatch = useListItemDispatch()
  const listItem = useSingleListItemState({
    bookId: book.id,
  })
  const {isPending, isRejected, run, error} = useAsync({
    deferFn: toggleListItem,
    dispatch: readingListDispatch,
    listItem,
    user,
    book,
  })

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
        ) : (
          <Tooltip
            label={
              listItem ? 'Remove from Reading List' : 'Add to Reading List'
            }
          >
            <button className="discover__add_button" onClick={run}>
              {listItem ? (
                <FaMinus aria-label="remove" />
              ) : (
                <FaPlus aria-label="add" />
              )}
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
