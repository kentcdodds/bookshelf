/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {useAsync} from 'react-async'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import * as mq from '../styles/media-queries'
import Rating from '../components/rating'
import {useSingleListItemState} from '../context/list-item-context'
import * as bookClient from '../utils/books'

function getBook({bookId}) {
  return bookClient.read(bookId).then(data => data.book)
}

const formatDate = date =>
  new Intl.DateTimeFormat('en-US', {month: 'short', year: '2-digit'}).format(
    date,
  )

function BookScreen({bookId}) {
  const {data: book, isPending, isRejected, isResolved, error} = useAsync({
    promiseFn: getBook,
    bookId,
  })
  const listItem = useSingleListItemState({
    bookId: book ? book.id : null,
  })

  if (isPending) {
    return '...'
  }
  if (isRejected) {
    return (
      <div style={{color: 'red'}}>
        <p>Oh no, there was an error.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (isResolved && !book) {
    return (
      <div style={{color: 'red'}}>
        <p>Hmmm... Something's not quite right. Please try another book.</p>
      </div>
    )
  }

  const {title, author, coverImageUrl, publisher, synopsis} = book

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{
            width: '100%',
            maxWidth: 200,
          }}
        />
        <div>
          <h1>{title}</h1>
          <div>
            <i>{author}</i>
            <span css={{marginRight: 6, marginLeft: 6}}>|</span>
            <i>{publisher}</i>
          </div>
          <div css={{marginTop: 25}}>
            {listItem ? <Rating rating={listItem.rating} /> : null}
            {listItem ? (
              <Tooltip
                label={
                  listItem.finishDate ? 'Start and finish date' : 'Start date'
                }
              >
                <div css={{marginTop: 6}}>
                  <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
                  <span>
                    {formatDate(listItem.startDate)}{' '}
                    {listItem.finishDate
                      ? `— ${formatDate(listItem.finishDate)}`
                      : null}
                  </span>
                </div>
              </Tooltip>
            ) : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {listItem ? (
        <React.Fragment>
          <h3>Notes</h3>
          {listItem.notes}
        </React.Fragment>
      ) : null}
    </div>
  )
}

export default BookScreen
