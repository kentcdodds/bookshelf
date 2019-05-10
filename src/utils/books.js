import client from './api-client'

function search(search) {
  return client(`books?query=${encodeURIComponent(search)}`).then(
    data => data.books,
  )
}

export {search}
