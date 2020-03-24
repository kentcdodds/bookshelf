/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import debounceFn from 'debounce-fn'
import {useUpdateListItem} from '../utils/list-items'
import {FaStar} from 'react-icons/fa'
import * as colors from '../styles/colors'

function Rating({listItem}) {
  const [isTabbing, setIsTabbing] = React.useState(false)
  const [rating, setRating] = React.useState(listItem.rating)

  const [mutate, {error}] = useUpdateListItem(listItem)

  const debouncedMutate = React.useCallback(
    debounceFn((...args) => mutate(...args).catch(e => e), {wait: 300}),
    [],
  )

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
          defaultChecked={ratingValue === rating}
          onChange={() => {
            setRating(ratingValue)
            debouncedMutate({rating: ratingValue})
          }}
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
            [`.${rootClassName} &:hover + label`]: {
              color: 'orange !important',
            },
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
            color: rating < 0 ? colors.gray20 : 'orange',
            margin: 0,
          }}
        >
          <span className="visually-hidden">
            {ratingValue} {ratingValue === 1 ? 'star' : 'stars'}
          </span>
          <FaStar css={{width: '16px', margin: '0 2px'}} />
        </label>
      </React.Fragment>
    )
  })
  return (
    <div
      onClick={e => e.stopPropagation()}
      className={rootClassName}
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        [`&.${rootClassName}:hover input + label`]: {
          color: 'orange',
        },
      }}
    >
      <span css={{display: 'flex'}}>{stars}</span>
      {error ? (
        <span css={{color: colors.danger, fontSize: '0.7em'}}>
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
