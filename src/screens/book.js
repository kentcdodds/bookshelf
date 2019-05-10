import React from 'react'
import Rating from '../components/rating'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'

function BookScreen({
  title = 'A Tale of Two Cities',
  author = 'Charles Dickens',
  description = `It was the time of the French Revolutiona time of great change and great danger. It was a time when injustice was met by a lust for vengeance, and rarely was a distinction made between the innocent and the guilty. Against this tumultuous historical backdrop, Dickens' great story of unsurpassed adventure and courage unfolds.\nUnjustly imprisoned for 18 years in the Bastille, Dr. Alexandre Manette is reunited with...`,
  notes = 'Notes',
  image = 'https://images-na.ssl-images-amazon.com/images/I/51rVPckPtuL._SX311_BO1,204,203,200_.jpg',
}) {
  return (
    <div className="book__cover">
      <div className="book__header">
        <img src={image} alt={`${title} book cover`} />
        <div>
          <h1>{title}</h1>
          <i>{author}</i>
          <div className="book__interactions">
            <Rating />
            <Tooltip label="Date read">
              <div>
                <span role="img">
                  <FaRegCalendarAlt />
                </span>
                {`August '19 — October '19 `}
              </div>
            </Tooltip>
          </div>
          <br />
          <p>{description}</p>
        </div>
      </div>
      <h3>Notes</h3>
      {notes}
    </div>
  )
}

export default BookScreen
