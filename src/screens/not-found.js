import React from 'react'
import {Link} from '../components/lib'

function NotFound() {
  return (
    <div className="grid items-center justify-center h-full">
      <div>
        Sorry... nothing here. <Link to="/">Go home</Link>
      </div>
    </div>
  )
}

export default NotFound
