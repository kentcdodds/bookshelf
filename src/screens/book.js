/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import debounceFn from 'debounce-fn'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {useParams} from 'react-router-dom'
import {useBook} from 'utils/books'
import {formatDate} from 'utils/misc'
import {useListItem, useUpdateListItem} from 'utils/list-items'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {Spinner, Textarea, ErrorMessage} from 'components/lib'
import {Rating} from 'components/rating'
import {Profiler} from 'components/profiler'
import {StatusButtons} from 'components/status-buttons'

function BookScreen() {
  const {bookId} = useParams()
  const book = useBook(bookId)
  const listItem = useListItem(bookId)

  const {title, author, coverImageUrl, publisher, synopsis} = book

  return (
    <Profiler id="Book Screen" metadata={{bookId, listItemId: listItem?.id}}>
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
            css={{width: '100%', maxWidth: '14rem'}}
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
                {book.loadingBook ? null : <StatusButtons book={book} />}
              </div>
            </div>
            <div css={{marginTop: 10, minHeight: 46}}>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
              {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
            </div>
            <br />
            <p css={{whiteSpace: 'break-spaces', display: 'block'}}>
              {synopsis}
            </p>
          </div>
        </div>
        {!book.loadingBook && listItem ? (
          <NotesTextarea listItem={listItem} />
        ) : null}
      </div>
    </Profiler>
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
  const [mutate, {error, isError, isLoading}] = useUpdateListItem()
  const debouncedMutate = React.useCallback(debounceFn(mutate, {wait: 300}), [])

  function handleNotesChange(e) {
    debouncedMutate({id: listItem.id, notes: e.target.value})
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
        {isError ? (
          <ErrorMessage
            variant="inline"
            error={error}
            css={{fontSize: '0.7em'}}
          />
        ) : null}
        {isLoading ? <Spinner /> : null}
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export {BookScreen}
