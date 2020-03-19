import {useQuery} from 'react-query'
import * as booksClient from './books-client'
import {loadingBook} from './book-placeholder'

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function searchBooks(queryKey, {query}) {
  return booksClient.search({query})
}

function useBookSearch(query) {
  const result = useQuery(['bookSearch', {query}], searchBooks)
  return {...result, data: result.data ?? {books: loadingBooks}}
}

function getBook(queryKey, {bookId}) {
  return booksClient.read(bookId).then(data => data.book)
}

function useBook(bookId) {
  const {data} = useQuery(['book', {bookId}], getBook)
  return data ?? loadingBook
}

export {useBook, useBookSearch}
