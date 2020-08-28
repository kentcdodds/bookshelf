import React from 'react'
import {useQuery, queryCache} from 'react-query'
import {AuthContext} from 'context/auth-context'
import {client} from './api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (query, user) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book)
      }
    },
  },
})

function useBookSearch(query) {
  const {user} = React.useContext(AuthContext)
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId) {
  const {user} = React.useContext(AuthContext)
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  const {user} = React.useContext(AuthContext)
  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries('bookSearch')
      await queryCache.prefetchQuery(getBookSearchConfig('', user))
    },
    [user],
  )
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function setQueryDataForBook(book) {
  queryCache.setQueryData({
    queryKey: ['book', {bookId: book.id}],
    queryFn: book,
    ...bookQueryConfig,
  })
}

export {useBook, useBookSearch, useRefetchBookSearchQuery, setQueryDataForBook}
