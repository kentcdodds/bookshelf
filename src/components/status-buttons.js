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
import * as colors from '../styles/colors'
import {useUser} from '../context/user-context'
import {
  useListItemDispatch,
  useSingleListItemState,
  removeListItem,
  updateListItem,
  addListItem,
} from '../context/list-item-context'
import useCallbackStatus from '../utils/use-callback-status'
import {CircleButton, Spinner} from './lib'

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

function StatusButtons({book}) {
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
