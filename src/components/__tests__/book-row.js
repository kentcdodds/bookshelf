import React from 'react'
import {render, screen, getRandomBook, cleanup} from 'test/app-test-utils'
import {BookRow} from '../book-row'

test('happy path', () => {
  const book = getRandomBook()
  console.log(book)
  render(<BookRow book={book} />)
  screen.debug()
  cleanup()
})
