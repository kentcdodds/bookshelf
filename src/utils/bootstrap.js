import {queryCache} from 'react-query'
import * as auth from './auth-client'
import * as listItemsClient from './list-items-client'

async function bootstrapAppData() {
  const data = await queryCache.prefetchQuery('user', auth.getUser)
  if (!data) {
    return {user: null, listItems: []}
  }
  const {user} = data
  const {listItems} = await queryCache.prefetchQuery(
    'list-items',
    listItemsClient.read,
  )
  return {
    user,
    listItems,
  }
}

export {bootstrapAppData}
