const usersKey = '__bookshelf_users__'
const users = {}
const persist = () =>
  window.localStorage.setItem(usersKey, JSON.stringify(users))
const load = () =>
  Object.assign(users, JSON.parse(window.localStorage.getItem(usersKey)))

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

function authenticate({username, password}) {
  const id = hash(username)
  const user = users[id] || {}
  if (user.passwordHash === hash(password)) {
    return {...user, token: btoa(user.id)}
  }
  throw new Error('Invalid username or password')
}

function create({username, password}) {
  const id = hash(username)
  const passwordHash = hash(password)
  if (users[id]) {
    throw new Error(`Cannot create a new user with the username "${username}"`)
  }
  users[id] = {id, username, passwordHash}
  persist()
}

function read(id) {
  load()
  if (users[id]) {
    const {passwordHash, ...user} = users[id]
    return user
  }
  throw new Error(`No user with the id "${id}"`)
}

function update(id, updates) {
  const user = read(id)
  Object.assign(user, updates)
  persist()
  return read(id)
}

// this would be called `delete` except that's a reserved word in JS :-(
function remove(id) {
  read(id)
  delete users[id]
  persist()
}

function hash(str) {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0
}

export {authenticate, create, read, update, remove}
