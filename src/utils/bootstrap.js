import {getUser} from './auth'
import {readForUser} from './list-items'

async function bootstrapAppData() {
  console.log('bootstrapping data')
  const data = await getUser()
  if (!data) {
    return {user: null, listItems: []}
  }
  const {user} = data
  const {listItems} = await readForUser(user.id)
  console.log('got app data', {user, listItems})
  return {
    user,
    listItems,
  }
}

export {bootstrapAppData}
