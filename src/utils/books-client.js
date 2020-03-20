import client from './api-client'

function search({query = ''}) {
  return client(`books?query=${encodeURIComponent(query)}`)
}

function read(bookId) {
  return client(`books/${bookId}`)
}

export {search, read}
