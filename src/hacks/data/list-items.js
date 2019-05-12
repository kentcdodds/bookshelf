const listItemsKey = '__bookshelf_list_items__'
const listItems = {}
const persist = () =>
  window.localStorage.setItem(listItemsKey, JSON.stringify(listItems))
const load = () =>
  Object.assign(
    listItems,
    JSON.parse(window.localStorage.getItem(listItemsKey)),
  )

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

window.__bookshelf = window.__bookshelf || {}
window.__bookshelf.purgeListItems = () => {
  Object.keys(listItems).forEach(key => {
    delete listItems[key]
  })
  persist()
}

function authorize(userId, listItemId) {
  const listItem = read(listItemId)
  if (listItem.ownerId !== userId) {
    throw new Error('User is not authorized to view that list')
  }
}

function create({
  bookId = required('bookId'),
  ownerId = required('ownerId'),
  rating = -1,
  notes = '',
  startDate = Date.now(),
  finishDate = null,
}) {
  const id = hash(`${bookId}${ownerId}`)
  if (listItems[id]) {
    throw new Error(`This user cannot create new list item for that book`)
  }
  listItems[id] = {id, bookId, ownerId, rating, notes, finishDate}
  persist()
  return read(id)
}

function read(id) {
  validateListItem(id)
  return listItems[id]
}

function update(id, updates) {
  validateListItem(id)
  Object.assign(listItems[id], updates)
  persist()
  return read(id)
}

// this would be called `delete` except that's a reserved word in JS :-(
function remove(id) {
  validateListItem(id)
  delete listItems[id]
  persist()
}

function readMany(userId, listItemIds) {
  return listItemIds.map(id => {
    authorize(userId, id)
    return read(id)
  })
}

function readByOwner(userId) {
  return Object.values(listItems).filter(li => li.ownerId === userId)
}

function validateListItem(id) {
  load()
  if (!listItems[id]) {
    throw new Error(`No list item with the id "${id}"`)
  }
}

function hash(str) {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

function required(key) {
  return () => {
    throw new Error(`${key} is required`)
  }
}

export {authorize, create, read, update, remove, readMany, readByOwner}
