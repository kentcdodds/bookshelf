import {client} from './api-client'

function create(listItemData) {
  return client('list-items', {data: listItemData})
}

function read() {
  return client('list-items')
}

function update(listItemId, updates) {
  return client(`list-items/${listItemId}`, {
    method: 'PUT',
    data: updates,
  })
}

function remove(listItemId) {
  return client(`list-items/${listItemId}`, {method: 'DELETE'})
}

export {create, read, remove, update}
