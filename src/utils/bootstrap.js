import {prefetchQuery} from 'react-query'
import {getUser} from './auth-client'
import {readForUser} from './list-items-client'

async function bootstrapAppData() {
  const data = await prefetchQuery('user', getUser)
  if (!data) {
    return {user: null, listItems: []}
  }
  const {user} = data
  const {listItems} = await prefetchQuery('list-items', () =>
    readForUser(user.id),
  )
  return {
    user,
    listItems,
  }
}

export {bootstrapAppData}
