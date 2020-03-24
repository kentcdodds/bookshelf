import allBooks from './books-data.json'
import matchSorter from 'match-sorter'

function create(book) {
  allBooks.push(book)
  return book
}

function read(bookId) {
  return allBooks.find(book => book.id === bookId)
}

function readManyNotInList(ids) {
  return allBooks.filter(book => !ids.includes(book.id))
}

function query(search) {
  return matchSorter(allBooks, search, {
    keys: [
      'title',
      'author',
      'publisher',
      {threshold: matchSorter.rankings.CONTAINS, key: 'synopsis'},
    ],
  })
}

export {create, query, read, readManyNotInList}
