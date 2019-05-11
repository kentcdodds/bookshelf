import client from './api-client'

function search(search) {
  return client(`book?query=${encodeURIComponent(search)}`).then(
    data => data.books,
  )
}

function getBooks(bookIds) {
  return client(`book?bookIds=${encodeURIComponent(bookIds.join(','))}`).then(
    data => data.books,
  )
}

export {search, getBooks}
