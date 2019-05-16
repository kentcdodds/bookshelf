/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import debounceFn from 'debounce-fn'
import {useAsync} from 'react-async'
import {FaStar} from 'react-icons/fa'
import {useListItemDispatch, updateListItem} from '../context/list-item-context'
import * as colors from '../styles/colors'

function updateRating([rating], {dispatch, listItem}) {
  return updateListItem(dispatch, listItem.id, {rating})
}

function Rating({listItem}) {
  const [isTabbing, setIsTabbing] = React.useState(false)

  const dispatch = useListItemDispatch()
  const {isRejected, error, run} = useAsync({
    deferFn: updateRating,
    dispatch,
    listItem,
  })

  const debouncedRun = React.useCallback(debounceFn(run, {wait: 300}), [])

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        setIsTabbing(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown, {once: true})
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const rootClassName = `list-item-${listItem.id}`

  const stars = Array.from({length: 5}).map((x, i) => {
    const ratingId = `rating-${listItem.id}-${i}`
    const ratingValue = i + 1
    return (
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          defaultChecked={ratingValue === listItem.rating}
          onChange={() => debouncedRun(ratingValue)}
          className="visually-hidden"
          css={{
            [`.${rootClassName} &:checked ~ label`]: {color: colors.gray20},
            [`.${rootClassName} &:checked + label`]: {color: 'orange'},
            // !important is here because we're doing special non-css-in-js things
            // and so we have to deal with specificity and cascade. But, I promise
            // this is better than trying to make this work with JavaScript.
            // So deal with it 😎
            [`.${rootClassName} &:hover ~ label`]: {
              color: `${colors.gray20} !important`,
            },
            [`.${rootClassName} &:hover + label`]: {color: 'orange !important'},
            [`.${rootClassName} &:focus + label svg`]: {
              outline: isTabbing
                ? ['1px solid orange', '-webkit-focus-ring-color auto 5px']
                : 'initial',
            },
          }}
        />
        <label
          htmlFor={ratingId}
          css={{
            cursor: 'pointer',
            color: listItem.rating < 0 ? colors.gray20 : 'orange',
            margin: 0,
          }}
        >
          <span className="visually-hidden">
            {ratingValue} {ratingValue === 1 ? 'star' : 'stars'}
          </span>
          <FaStar
            css={{
              width: '16px',
              margin: '0 2px',
            }}
          />
        </label>
      </React.Fragment>
    )
  })
  return (
    <div css={{display: 'inline-block'}} onClick={e => e.stopPropagation()}>
      <div
        className={rootClassName}
        css={{
          display: 'flex',
          alignItems: 'center',
          [`&.${rootClassName}:hover input + label`]: {
            color: 'orange',
          },
        }}
      >
        <span
          css={{
            '& span:not(:last-child)': {
              marginRight: '5px',
            },
          }}
        >
          {stars}
        </span>
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
    </div>
  )
}

export default Rating
