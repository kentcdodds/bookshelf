import client from './api-client'

function create(listItemData) {
  return client('list-items', {body: listItemData})
}

function read(listItemIds = []) {
  return client('list-items')
}

function update(listItemId, updates) {
  return client(`list-items/${listItemId}`, {
    method: 'PUT',
    body: updates,
  })
}

function remove(listItemId) {
  return client(`list-items/${listItemId}`, {method: 'DELETE'})
}

export {create, read, remove, update}
