/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {useAsync} from 'react-async'
import * as booksClient from '../utils/books'
import BookRow from '../components/book-row'
import {BookListUL, Spinner} from '../components/lib'

function initialSearch() {
  return booksClient.search('')
}

function DiscoverBooksScreen() {
  const queryRef = React.useRef()
  const [hasSearched, setHasSearched] = React.useState()
  const {data, isPending, isRejected, error, reload} = useAsync({
    promiseFn: initialSearch,
    deferFn: booksClient.search,
  })
  const {books} = data || {books: []}

  function handleSearchClick(e) {
    e.preventDefault()
    setHasSearched(true)
    reload(queryRef.current.value)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <input
            ref={queryRef}
            placeholder="Search books..."
            id="search"
            css={{width: '100%'}}
          />
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
                  <Spinner />
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
        {hasSearched ? null : (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few books for you...</p>
            {isPending ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : (
              <p>Here you go! Find more books with the search bar above.</p>
            )}
          </div>
        )}
        <BookListUL css={{marginTop: 20}}>
          {books.map(book => (
            <li key={book.id}>
              <BookRow key={book.id} book={book} />
            </li>
          ))}
        </BookListUL>
      </div>
    </div>
  )
}

export default DiscoverBooksScreen
