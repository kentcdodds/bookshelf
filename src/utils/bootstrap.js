import {getUser} from './auth'
import {readForUser} from './list-items'

async function bootstrapAppData() {
  const data = await getUser()
  if (!data) {
    return {user: null, listItems: []}
  }
  const {user} = data
  const {listItems} = await readForUser(user.id)
  return {
    user,
    listItems,
  }
}

export {bootstrapAppData}
