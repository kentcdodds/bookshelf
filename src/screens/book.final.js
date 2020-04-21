/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {useParams} from 'react-router-dom'
import * as booksClient from 'utils/books-client'
import * as mq from 'styles/media-queries'
import {useAsync} from 'utils/use-async'
import {loadingBook} from 'utils/book-placeholder'

function BookScreen() {
  const {bookId} = useParams()
  const {data, run} = useAsync()

  React.useEffect(() => {
    run(booksClient.read(bookId))
  }, [run, bookId])

  const {title, author, coverImageUrl, publisher, synopsis} =
    data?.book ?? loadingBook

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
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
    </div>
  )
}

export {BookScreen}
