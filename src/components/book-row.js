/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'

import {Link} from '@reach/router'
import Tooltip from '@reach/tooltip'
import * as mq from '../styles/media-queries'
import * as colors from '../styles/colors'
import {Author, CircleButton} from './lib'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaTimesCircle,
  FaBook,
} from 'react-icons/fa'
import Rating from './rating'

function useIsMounted() {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return mounted
}

function TooltipButton({label, highlight, onClick, icon}) {
  const isMounted = useIsMounted()
  const [{status, error}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    {status: 'rest', error: null},
  )
  const safeSetState = (...args) =>
    isMounted.current ? setState(...args) : null

  const isPending = status === 'pending'
  const isRejected = status === 'rejected'

  function handleClick() {
    if (isRejected) {
      safeSetState({status: 'rest'})
    }

    safeSetState({status: 'pending'})
    onClick().then(
      value => {
        safeSetState({status: 'rest'})
        return value
      },
      error => {
        safeSetState({status: 'rejected', error})
        return Promise.reject(error)
      },
    )
  }

  return (
    <Tooltip label={isRejected ? error.message : label}>
      <CircleButton
        css={{':hover,:focus': {color: isPending ? colors.gray80 : highlight}}}
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? <FaBook /> : isRejected ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function BookRow({
  book,
  listItem,
  onAddClick,
  onMarkAsReadClick,
  onRemoveClick,
}) {
  const {title, author, coverImageUrl} = book

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
          flexGrow: 2,
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gridGap: 20,
          border: `1px solid ${colors.gray20}`,
          color: colors.text,
          padding: '1.25em',
          borderRadius: '3px',
          ':hover,:focus': {
            textDecoration: 'none',
            boxShadow: '0 5px 15px -5px rgba(0,0,0,.08)',
            color: 'inherit',
          },
        }}
      >
        <div
          css={{
            width: 140,
            [mq.small]: {
              width: 100,
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{maxHeight: '100%', maxWidth: '100%'}}
          />
        </div>
        <div css={{flex: 1}}>
          <div css={{display: 'flex', justifyContent: 'space-between'}}>
            <div css={{flex: 1}}>
              <h2
                css={{
                  fontSize: '1.25em',
                  margin: '0',
                  color: colors.indigo,
                }}
              >
                {title}
              </h2>
              {listItem ? <Rating rating={listItem.rating} /> : null}
            </div>
            <div css={{marginLeft: 10}}>
              <Author css={{marginTop: '0.4em'}}>{author}</Author>
              <small>{book.publisher}</small>
            </div>
          </div>
          <small>{book.synopsis.substring(0, 500)}...</small>
        </div>
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
        {listItem ? (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={onMarkAsReadClick}
            icon={<FaCheckCircle />}
          />
        ) : null}
        {listItem ? (
          <TooltipButton
            label="Remove from list"
            highlight={colors.danger}
            onClick={onRemoveClick}
            icon={<FaMinusCircle />}
          />
        ) : (
          <TooltipButton
            label="Add to list"
            highlight={colors.indigo}
            onClick={onAddClick}
            icon={<FaPlusCircle />}
          />
        )}
      </div>
    </div>
  )
}

export default BookRow
