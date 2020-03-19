/** @jsx jsx */
import {jsx} from '@emotion/core'

import tw from 'twin.macro'
import React from 'react'
import debounceFn from 'debounce-fn'
import {useMutation, queryCache} from 'react-query'
import {FaStar} from 'react-icons/fa'
import * as listItemsClient from '../utils/list-items-client'
import * as colors from '../styles/colors'

function Rating({listItem}) {
  const [isTabbing, setIsTabbing] = React.useState(false)

  const [mutate, {error}] = useMutation(
    rating => listItemsClient.update(listItem.id, {rating}),
    {
      onSettled: () => queryCache.refetchQueries('list-items'),
      useErrorBoundary: false,
    },
  )

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
          defaultChecked={ratingValue === listItem.rating}
          onChange={() => debouncedMutate(ratingValue)}
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
          css={[
            tw`m-0 cursor-pointer`,
            listItem.rating < 0 ? tw`text-gray-100` : {color: 'orange'},
          ]}
        >
          <span className="visually-hidden">
            {ratingValue} {ratingValue === 1 ? 'star' : 'stars'}
          </span>
          <FaStar css={[tw`w-4`, {margin: '0 0.1rem'}]} />
        </label>
      </React.Fragment>
    )
  })
  return (
    <div
      onClick={e => e.stopPropagation()}
      className={rootClassName}
      css={[
        tw`inline-flex items-center`,
        {
          [`&.${rootClassName}:hover input + label`]: {
            color: 'orange',
          },
        },
      ]}
    >
      <span css={tw`flex`}>{stars}</span>
      {error ? (
        <span css={tw`ml-3 text-xs text-danger`}>
          <span>There was an error:</span>{' '}
          <pre css={[tw`inline-block m-0 overflow-scroll`, {marginBottom: -5}]}>
            {error?.message}
          </pre>
        </span>
      ) : null}
    </div>
  )
}

export default Rating
