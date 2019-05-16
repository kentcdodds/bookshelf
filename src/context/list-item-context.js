import React from 'react'
import {useAuth} from './auth-context'
import {useUser} from './user-context'
import * as listItemClient from '../utils/list-items-client'

const ListItemStateContext = React.createContext()
const ListItemDispatchContext = React.createContext()

function listReducer(listItems, action) {
  switch (action.type) {
    case 'add': {
      return [...listItems, action.listItem]
    }
    case 'remove': {
      return listItems.filter(li => li.id !== action.id)
    }
    case 'update': {
      return listItems.map(li => {
        if (li.id === action.listItem.id) {
          return {...li, ...action.listItem}
        }
        return li
      })
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function ListItemProvider({children}) {
  const {data} = useAuth()
  const [state, dispatch] = React.useReducer(listReducer, data.listItems)
  return (
    <ListItemStateContext.Provider value={state}>
      <ListItemDispatchContext.Provider value={dispatch}>
        {children}
      </ListItemDispatchContext.Provider>
    </ListItemStateContext.Provider>
  )
}

function removeListItem(dispatch, id) {
  return listItemClient.remove(id).then(data => {
    dispatch({type: 'remove', id})
    return data
  })
}

function addListItem(dispatch, listItemData) {
  return listItemClient.create(listItemData).then(data => {
    dispatch({type: 'add', listItem: data.listItem})
    return data
  })
}

function updateListItem(dispatch, listItemId, updates) {
  return listItemClient.update(listItemId, updates).then(data => {
    dispatch({type: 'update', listItem: data.listItem})
    return data
  })
}

function useListItemDispatch() {
  const context = React.useContext(ListItemDispatchContext)
  if (context === undefined) {
    throw new Error(
      `useListItemDispatch must be used within a ListItemProvider`,
    )
  }
  return context
}

function useListItemState() {
  const context = React.useContext(ListItemStateContext)
  if (context === undefined) {
    throw new Error(`useListItemState must be used within a ListItemProvider`)
  }
  return context
}

function useSingleListItemState({bookId}) {
  const listItems = useListItemState()
  if (!listItems) {
    throw new Error(`useListItemState must be used within a ListItemProvider`)
  }
  const user = useUser()
  const listItem = listItems.find(
    li => li.ownerId === user.id && li.bookId === bookId,
  )
  return listItem
}

export {
  ListItemProvider,
  useListItemDispatch,
  useListItemState,
  useSingleListItemState,
  removeListItem,
  addListItem,
  updateListItem,
}
