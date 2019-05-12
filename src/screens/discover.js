/** @jsx jsx */
import {jsx, keyframes} from '@emotion/core'

import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaSpinner, FaTimes} from 'react-icons/fa'
import {useAsync} from 'react-async'
import {useUser} from '../context/user-context'
import * as booksClient from '../utils/books'
import {
  useListItemDispatch,
  useSingleListItemState,
  addListItem,
  removeListItem,
} from '../context/list-item-context'
import BookRow from '../components/book-row'
import {BookListUL} from '../components/lib'

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

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
              <button
                type="submit"
                css={{
                  border: '0',
                  position: 'relative',
                  marginLeft: '-35px',
                  background: 'transparent',
                }}
              >
                {isPending ? (
                  <FaSpinner
                    css={{animation: `${spin} 1s linear infinite`}}
                    aria-label="loading"
                  />
                ) : isRejected ? (
                  <FaTimes aria-label="error" css={{color: 'red'}} />
                ) : (
                  <FaSearch aria-label="search" />
                )}
              </button>
            </label>
          </Tooltip>
        </form>

        {isRejected ? (
          <div style={{color: 'red'}}>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        <br />
        <BookListUL>
          {books.map(book => (
            <li key={book.id}>
              <DiscoverBookRow key={book.id} book={book} />
            </li>
          ))}
        </BookListUL>
      </div>
    </div>
  )
}

function DiscoverBookRow({book}) {
  const user = useUser()
  const dispatch = useListItemDispatch()
  const listItem = useSingleListItemState({
    bookId: book.id,
  })
  function handleAddClick() {
    return addListItem(dispatch, {ownerId: user.id, bookId: book.id})
  }

  function handleRemoveClick() {
    return removeListItem(dispatch, listItem.id)
  }

  return (
    <BookRow
      book={book}
      listItem={listItem}
      onAddClick={handleAddClick}
      onRemoveClick={handleRemoveClick}
    />
  )
}

export default DiscoverBooksScreen
