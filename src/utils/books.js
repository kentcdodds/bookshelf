import client from './api-client'

function search(search) {
  return client(`book?query=${encodeURIComponent(search)}`)
}

function read(bookId) {
  return client(`book/${bookId}`)
}

export {search, read}
