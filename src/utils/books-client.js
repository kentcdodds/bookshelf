import client from './api-client'

function search(query) {
  return client(`book?query=${encodeURIComponent(query)}`)
}

function read(bookId) {
  return client(`book/${bookId}`)
}

export {search, read}
