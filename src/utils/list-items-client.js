import client from './api-client'

function create(listItemData) {
  return client('list-items', {body: listItemData})
}

function read(listItemIds = []) {
  if (listItemIds.length) {
    return client(
      `list-items?listItemIds=${encodeURIComponent(listItemIds.join(','))}`,
    )
  }
  return client('list-items')
}

function update(listItemId, updates) {
  return client(`list-items/${listItemId}`, {
    method: 'PUT',
    body: updates,
  })
}

function readByBookId(bookId) {
  return client(`list-items?bookId=${encodeURIComponent(bookId)}`)
}

function remove(listItemId) {
  return client(`list-items/${listItemId}`, {method: 'DELETE'})
}

export {create, read, remove, update, readByBookId}
