import client from './api-client'

function getBooks() {
  return client('user/reading-list')
}

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

export {getBooks, addBookToReadingList, removeBookFromReadingList}
