/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {useUpdateListItem} from 'utils/list-items'
import {FaStar} from 'react-icons/fa'
import * as colors from 'styles/colors'
import {ErrorMessage} from 'components/lib'

const visuallyHiddenCSS = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px',
}
function Rating({listItem}) {
  const [isTabbing, setIsTabbing] = React.useState(false)
  const [update, {error, isError}] = useUpdateListItem()

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
          checked={ratingValue === listItem.rating}
          onChange={() => {
            update({id: listItem.id, rating: ratingValue})
          }}
          css={[
            visuallyHiddenCSS,
            {
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
            },
          ]}
        />
        <label
          htmlFor={ratingId}
          css={{
            cursor: 'pointer',
            color: listItem.rating < 0 ? colors.gray20 : 'orange',
            margin: 0,
          }}
        >
          <span css={visuallyHiddenCSS}>
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
      {isError ? (
        <ErrorMessage
          error={error}
          variant="inline"
          css={{marginLeft: 6, fontSize: '0.7em'}}
        />
      ) : null}
    </div>
  )
}

export {Rating}
