/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
} from 'react-icons/fa'
import {FaTimesCircle} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {useQuery, useMutation} from 'react-query'
import * as colors from '../styles/colors'
import {useUser} from '../context/user-context'
import * as listItemsClient from '../utils/list-items-client'
import useCallbackStatus from '../utils/use-callback-status'
import {CircleButton, Spinner} from './lib'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
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
        aria-label={isRejected ? error.message : label}
        {...rest}
      >
        {isPending ? <Spinner /> : isRejected ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({book}) {
  const user = useUser()
  const {data: listItems, error: listItemError} = useQuery(
    'list-item',
    listItemsClient.read,
  )
  React.useLayoutEffect(() => {
    if (listItemError) throw listItemError
  }, [listItemError])

  const listItem = listItems.find(li => li.bookId === book.id)

  const [handleRemoveClick] = useMutation(() =>
    listItemsClient.remove(listItem.id),
  )

  const [handleMarkAsReadClick] = useMutation(updates =>
    listItemsClient.update(listItem.id, {finishDate: Date.now()}),
  )

  const [handleAddClick] = useMutation(() =>
    listItemsClient.create(listItem.id, {ownerId: user.id, bookId: book.id}),
  )

  const [handleMarkAsUnreadClick] = useMutation(() =>
    listItemsClient.update(listItem.id, {finishDate: null}),
  )

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default StatusButtons
