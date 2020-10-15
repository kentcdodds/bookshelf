import booksData from './books-data.json'
import {matchSorter} from 'match-sorter'

let books = [...booksData]

async function create(book) {
  books.push(book)
  return book
}

async function read(bookId) {
  return books.find(book => book.id === bookId)
}

async function readManyNotInList(ids) {
  return books.filter(book => !ids.includes(book.id))
}

async function query(search) {
  return matchSorter(books, search, {
    keys: [
      'title',
      'author',
      'publisher',
      {threshold: matchSorter.rankings.CONTAINS, key: 'synopsis'},
    ],
  })
}

async function reset() {
  books = [...booksData]
}

export {create, query, read, readManyNotInList, reset}
