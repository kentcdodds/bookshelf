import React from 'react'
import {FaStar} from 'react-icons/fa'

function Rating() {
  return (
    <div className="rating">
      <FaStar color="orange" /> <FaStar color="orange" />
      <FaStar color="orange" /> <FaStar color="orange" /> <FaStar />
    </div>
  )
}

export default Rating
