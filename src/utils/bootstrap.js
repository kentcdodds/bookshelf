import {getUser} from './auth'
import {readForUser} from './list-items'

async function bootstrapAppData() {
  const {user} = await getUser()
  if (!user) {
    return {user: null, listItems: []}
  }
  const {listItems} = await readForUser(user.id)
  return {
    user,
    listItems,
  }
}

export {bootstrapAppData}
