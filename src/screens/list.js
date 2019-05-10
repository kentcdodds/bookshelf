import React from 'react'
import Rating from '../components/rating'
import {FaPlus, FaCheckCircle} from 'react-icons/fa'
import {Link} from '@reach/router'
import Tooltip from '@reach/tooltip'

const ReadingListItem = ({
  title = 'A Tale of Two Cities',
  author = 'Charles Dickens',
  notes = 'Notes',
  image = 'https://images-na.ssl-images-amazon.com/images/I/51rVPckPtuL._SX311_BO1,204,203,200_.jpg',
}) => {
  return (
    <li>
      <Link to="/book" className="item item__reading-list">
        <div className="item__image">
          <img src={image} alt={`${title} book cover`} />
        </div>
        <div>
          <h2 className="item__title">{title}</h2>
          <Rating />
          <p>{notes}</p>
        </div>
        <div className="author author--mt">{author}</div>
      </Link>
      <Tooltip label="Mark as read">
        <button className="button--circle button--mark-as-read">
          <FaCheckCircle />
        </button>
      </Tooltip>
    </li>
  )
}

function ReadingListScreen() {
  return (
    <div>
      <div className="action-bar">
        <button className="button--icon">
          <span aria-label="plus icon" role="img">
            <FaPlus size="10px" />
          </span>
          Add Book
        </button>
      </div>
      <div className="reading-list">
        <ul>
          <ReadingListItem />
          <ReadingListItem
            notes="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            fermentum in nunc vel placerat..."
          />
          <ReadingListItem />
          <ReadingListItem />
          <ReadingListItem />
          <ReadingListItem />
        </ul>
      </div>
    </div>
  )
}

export default ReadingListScreen
