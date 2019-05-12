import React from 'react'
import {FaStar} from 'react-icons/fa'
import * as colors from '../styles/colors'

function Rating({rating}) {
  const stars = Array.from({length: 5}).map((x, i) => {
    return <FaStar key={i} color={i < rating ? 'orange' : colors.gray20} />
  })
  return (
    <div
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
      {stars}
    </div>
  )
}

export default Rating
