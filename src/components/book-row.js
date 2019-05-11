import './book-row.scss'
import React from 'react'
import {FaCheckCircle, FaMinusCircle} from 'react-icons/fa'
import {Link} from '@reach/router'
import Tooltip from '@reach/tooltip'
import Rating from './rating'

function BookRow({book}) {
  const {title, author, notes, coverImageUrl} = book
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      <Link to="/book" className="book-row">
        <div className="book-row__image">
          <img src={coverImageUrl} alt={`${title} book cover`} />
        </div>
        <div>
          <h2 className="book-row__title">{title}</h2>
          <Rating />
          <p>{notes}</p>
        </div>
        <div className="author author--mt">{author}</div>
      </Link>
      <div className="book-row__action-buttons">
        <Tooltip label="Mark as read">
          <button className="button--circle book-row__mark-as-read">
            <FaCheckCircle />
          </button>
        </Tooltip>
        <Tooltip label="Remove from list">
          <button className="button--circle book-row__remove-from-list">
            <FaMinusCircle />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default BookRow
