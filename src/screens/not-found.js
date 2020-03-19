/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from '../components/lib'

function NotFound() {
  return (
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        Sorry... nothing here. <Link to="/">Go home</Link>
      </div>
    </div>
  )
}

export default NotFound
