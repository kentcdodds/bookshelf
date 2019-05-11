/** @jsx jsx */
import {jsx} from '@emotion/core'
import * as mq from '../styles/media-queries'
import * as colors from '../styles/colors'
import {Author} from './lib'

import {FaCheckCircle, FaMinusCircle} from 'react-icons/fa'
import {Link} from '@reach/router'
import Tooltip from '@reach/tooltip'
import Rating from './rating'

function BookRow({book}) {
  const {title, author, notes, coverImageUrl} = book
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      <Link
        to="/book"
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 5fr 2fr 0.2fr',
          gridGap: '2em',
          border: `1px solid ${colors.gray20}`,
          color: colors.text,
          padding: '1.25em',
          borderRadius: '3px',
          [mq.small]: {
            gridTemplateColumns: '1fr',
          },
        }}
      >
        <div
          css={{
            height: 160,
            [mq.small]: {
              height: 200,
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{maxHeight: '100%'}}
          />
        </div>
        <div>
          <h2
            css={{
              fontSize: '1.25em',
              margin: '0',
            }}
          >
            {title}
          </h2>
          <Rating />
          <p
            css={{
              marginTop: '0.5em',
              marginBottom: '0',
            }}
          >
            {notes}
          </p>
        </div>
        <Author css={{marginTop: '0.4em'}}>{author}</Author>
      </Link>
      <div
        css={{
          marginLeft: '20px',
          position: 'absolute',
          color: colors.gray80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}
      >
        <Tooltip label="Mark as read">
          <button
            className="button--circle"
            css={{':hover,:focus': {color: colors.green}}}
          >
            <FaCheckCircle />
          </button>
        </Tooltip>
        <Tooltip label="Remove from list">
          <button
            className="button--circle"
            css={{':hover,:focus': {color: colors.danger}}}
          >
            <FaMinusCircle />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default BookRow
