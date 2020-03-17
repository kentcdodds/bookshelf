import client from './api-client'

function create(listItemData) {
  return client('list-item', {body: listItemData})
}

function read(listItemIds) {
  if (listItemIds.length) {
    return client(
      `list-item?listItemIds=${encodeURIComponent(listItemIds.join(','))}`,
    )
  }
  return client('list-item')
}

function update(listItemId, updates) {
  return client(`list-item/${listItemId}`, {
    method: 'PUT',
    body: updates,
  })
}

function readForUser(ownerId) {
  return client(`list-item?ownerId=${encodeURIComponent(ownerId)}`)
}

function readByBookId(bookId) {
  return client(`list-item?bookId=${encodeURIComponent(bookId)}`)
}

function remove(listItemId) {
  return client(`list-item/${listItemId}`, {method: 'DELETE'})
}

export {create, read, remove, readForUser, update, readByBookId}
