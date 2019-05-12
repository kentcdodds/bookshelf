/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from '@reach/router'
import Tooltip from '@reach/tooltip'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaTimesCircle,
  FaBook,
} from 'react-icons/fa'
import * as mq from '../styles/media-queries'
import * as colors from '../styles/colors'
import {Author, CircleButton, Spinner} from './lib'
import {useUser} from '../context/user-context'
import {
  useListItemDispatch,
  useSingleListItemState,
  removeListItem,
  updateListItem,
  addListItem,
} from '../context/list-item-context'
import useCallbackStatus from '../utils/use-callback-status'
import Rating from './rating'

function TooltipButton({label, highlight, onClick, icon}) {
  const {isPending, isRejected, error, run} = useCallbackStatus()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isRejected ? error.message : label}>
      <CircleButton
        css={{':hover,:focus': {color: isPending ? colors.gray80 : highlight}}}
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? <Spinner /> : isRejected ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function BookRow({book}) {
  const {title, author, coverImageUrl} = book
  const user = useUser()
  const dispatch = useListItemDispatch()
  const listItem = useSingleListItemState({
    bookId: book.id,
  })

  function handleRemoveClick() {
    return removeListItem(dispatch, listItem.id)
  }

  function handleMarkAsReadClick() {
    return updateListItem(dispatch, listItem.id, {finishDate: Date.now()})
  }

  function handleAddClick() {
    return addListItem(dispatch, {ownerId: user.id, bookId: book.id})
  }

  function handleMarkAsUnreadClick() {
    return updateListItem(dispatch, listItem.id, {finishDate: null})
  }

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
        to={`/book/${book.id}`}
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
          Boolean(listItem.finishDate) ? (
            <TooltipButton
              label="Unmark as read"
              highlight={colors.yellow}
              onClick={handleMarkAsUnreadClick}
              icon={<FaBook />}
            />
          ) : (
            <TooltipButton
              label="Mark as read"
              highlight={colors.green}
              onClick={handleMarkAsReadClick}
              icon={<FaCheckCircle />}
            />
          )
        ) : null}
        {listItem ? (
          <TooltipButton
            label="Remove from list"
            highlight={colors.danger}
            onClick={handleRemoveClick}
            icon={<FaMinusCircle />}
          />
        ) : (
          <TooltipButton
            label="Add to list"
            highlight={colors.indigo}
            onClick={handleAddClick}
            icon={<FaPlusCircle />}
          />
        )}
      </div>
    </div>
  )
}

export default BookRow
