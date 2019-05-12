/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {useAsync} from 'react-async'
import {FaStar} from 'react-icons/fa'
import {useListItemDispatch, updateListItem} from '../context/list-item-context'
import * as colors from '../styles/colors'

function updateNotes([index], {dispatch, listItem}) {
  return updateListItem(dispatch, listItem.id, {rating: index + 1})
}

function Rating({listItem}) {
  const {rating} = listItem
  // rating is base 1 and array indexes are base 0
  // so we initialize to -1 the rating
  const [orangeIndex, setOrangeIndex] = React.useState(rating - 1)
  React.useEffect(() => {
    setOrangeIndex(listItem.rating - 1)
  }, [listItem.rating])

  const dispatch = useListItemDispatch()
  const {isRejected, isPending, error, run} = useAsync({
    deferFn: updateNotes,
    dispatch,
    listItem,
  })

  function setOrageIdx(index) {
    if (!isPending) {
      setOrangeIndex(index)
    }
  }

  const stars = Array.from({length: 5}).map((x, i) => {
    return (
      <button
        key={i}
        onClick={() => run(i)}
        onFocus={() => setOrageIdx(i)}
        onMouseOver={() => setOrageIdx(i)}
        css={{
          border: 'none',
          padding: '0',
          margin: '0',
          ':focus': {outline: 'none'},
        }}
      >
        <FaStar color={i <= orangeIndex ? 'orange' : colors.gray20} />
      </button>
    )
  })
  return (
    <div
      onBlur={() => setOrageIdx(rating - 1)}
      onMouseOut={() => setOrageIdx(rating - 1)}
      css={{
        display: 'flex',
        alignItems: 'center',
        '& span': {
          marginRight: '5px',
        },
        '& svg': {
          width: '16px',
          margin: '0 2px',
        },
      }}
    >
      <span>{stars}</span>
      {isRejected ? (
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
    </div>
  )
}

export default Rating
