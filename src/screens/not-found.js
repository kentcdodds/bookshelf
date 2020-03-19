/** @jsx jsx */
import {jsx} from '@emotion/core'

import tw from 'twin.macro'
import {Link} from '../components/lib'

function NotFound() {
  return (
    <div css={tw`grid items-center justify-center h-full`}>
      <div>
        Sorry... nothing here. <Link to="/">Go home</Link>
      </div>
    </div>
  )
}

export default NotFound
