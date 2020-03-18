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
import {useQuery, useMutation, queryCache} from 'react-query'
import * as colors from '../styles/colors'
import * as listItemsClient from '../utils/list-items-client'
import useAsync from '../utils/use-async'
import {CircleButton, Spinner} from './lib'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const {isPending, isRejected, error, run} = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isRejected ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isPending
              ? colors.gray80
              : isRejected
              ? colors.danger
              : highlight,
          },
        }}
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

function useListItem(bookId) {
  const {data: listItems} = useQuery('list-items', () =>
    listItemsClient.read().then(d => d.listItems),
  )
  return listItems?.find(li => li.bookId === bookId) ?? null
}

function StatusButtons({book}) {
  const listItem = useListItem(book.id)

  const [handleRemoveClick] = useMutation(
    () => listItemsClient.remove(listItem.id),
    {
      onSettled: () => queryCache.refetchQueries('list-items'),
      useErrorBoundary: false,
      throwOnError: true,
    },
  )

  const [handleMarkAsReadClick] = useMutation(
    updates => listItemsClient.update(listItem.id, {finishDate: Date.now()}),
    {
      onSettled: () => queryCache.refetchQueries('list-items'),
      useErrorBoundary: false,
      throwOnError: true,
    },
  )

  const [handleAddClick] = useMutation(
    () => listItemsClient.create({bookId: book.id}),
    {
      onSettled: () => queryCache.refetchQueries('list-items'),
      useErrorBoundary: false,
      throwOnError: true,
    },
  )

  const [handleMarkAsUnreadClick] = useMutation(
    () => listItemsClient.update(listItem.id, {finishDate: null}),
    {
      onSettled: () => queryCache.refetchQueries('list-items'),
      useErrorBoundary: false,
      throwOnError: true,
    },
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
