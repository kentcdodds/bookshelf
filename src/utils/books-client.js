import {client} from './api-client'

function search({query = ''}) {
  return client(`books?query=${encodeURIComponent(query)}`)
}

export {search}
