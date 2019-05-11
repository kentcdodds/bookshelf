import client from './api-client'

function addBookToReadingList(bookId) {
  return client('user/reading-list', {
    method: 'PUT',
    body: {bookId},
  })
}

function removeBookFromReadingList(bookId) {
  return client(`user/reading-list/${bookId}`, {
    method: 'DELETE',
  })
}

export {addBookToReadingList, removeBookFromReadingList}
