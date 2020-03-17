/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {useQuery, useMutation, queryCache} from 'react-query'
import debounceFn from 'debounce-fn'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import * as mq from '../styles/media-queries'
import * as colors from '../styles/colors'
import {Spinner} from '../components/lib'
import Rating from '../components/rating'
import * as booksClient from '../utils/books-client'
import * as listItemsClient from '../utils/list-items-client'
import StatusButtons from '../components/status-buttons'

function getBook(queryKey, {bookId}) {
  return booksClient.read(bookId).then(data => data.book)
}

function useListItem(bookId) {
  const {data: listItems} = useQuery('list-items', () =>
    listItemsClient.read().then(d => d.listItems),
  )
  return listItems?.find(li => li.bookId === bookId) ?? null
}

const formatDate = date =>
  new Intl.DateTimeFormat('en-US', {month: 'short', year: '2-digit'}).format(
    date,
  )

function BookScreen({bookId}) {
  const {data: book} = useQuery(['book', {bookId}], getBook)
  const listItem = useListItem(bookId)

  if (!book) {
    return (
      <div css={{marginTop: '2em', fontSize: '2em', textAlign: 'center'}}>
        <Spinner />
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
          <div css={{display: 'flex', position: 'relative'}}>
            <div css={{flex: 1, justifyContent: 'space-between'}}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}
            >
              <StatusButtons book={book} />
            </div>
          </div>
          <div css={{marginTop: 10, height: 46}}>
            {listItem ? (
              <>
                <Rating listItem={listItem} />
                <ListItemTimeframe listItem={listItem} />
              </>
            ) : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {listItem ? <NotesTextarea listItem={listItem} /> : null}
    </div>
  )
}

function ListItemTimeframe({listItem}) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

function NotesTextarea({listItem}) {
  const [mutate, {status, error}] = useMutation(
    ({notes}) => listItemsClient.update(listItem.id, {notes}),
    {
      onSettled: () => {
        queryCache.refetchQueries('list-items')
      },
      useErrorBoundary: false,
    },
  )
  const debouncedMutate = React.useCallback(debounceFn(mutate, {wait: 300}), [])

  function handleNotesChange(e) {
    debouncedMutate(
      {notes: e.target.value},
      {updateQuery: ['list-items', {bookId: listItem.bookId}]},
    )
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
        {error ? (
          <span css={{color: 'red', fontSize: '0.7em'}}>
            <span>There was an error:</span>{' '}
            <pre
              css={{
                display: 'inline-block',
                overflow: 'scroll',
                margin: '0',
                marginBottom: -5,
              }}
            >
              {error.message}
            </pre>
          </span>
        ) : null}
        {status === 'loading' ? <Spinner /> : null}
      </div>
      <textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export default BookScreen
