import React from 'react'
import * as listItemClient from '../utils/list-items'
import {useUserState} from './user-context'

const ListItemStateContext = React.createContext()
const ListItemDispatchContext = React.createContext()

const initialState = {
  status: null,
  pending: null,
  error: null,
  listItems: [],
}

const itemInitialState = {
  status: null, // null | 'pending' | 'resolved' | 'rejected'
  pending: null, // null | 'create' | 'read' | 'update' | 'remove'
  error: null,
  data: [],
  // ownerId, // every item will have one of these
  // bookId, // every item will have one of these
}

function listItemReducer(state, action) {
  const {listItems} = state
  switch (action.type) {
    case 'initialize': {
      return {...state, pending: action.type}
    }
    case 'initializing': {
      return {...state, status: 'pending'}
    }
    case 'initialized': {
      return {
        ...state,
        status: 'resolved',
        pending: null,
        listItems: action.listItems.map(li => ({
          ...itemInitialState,
          status: 'resolved',
          ownerId: li.ownerId,
          bookId: li.bookId,
          data: li,
        })),
      }
    }
    case 'initialize error': {
      return {...state, status: 'rejected', pending: null, error: action.error}
    }
    case 'reset': {
      return {...initialState}
    }
    case 'create': {
      const {bookId, ownerId} = action
      const existingListItem = listItems.find(
        li => li.bookId === bookId && li.ownerId === ownerId,
      )
      if (existingListItem) {
        throw new Error(
          `A list item already exists for the book ${bookId} with the owner ${ownerId}`,
        )
      }
      return {
        ...state,
        listItems: [
          ...listItems,
          {
            ...itemInitialState,
            pending: action.type,
            ownerId,
            bookId,
            data: {ownerId, bookId},
          },
        ],
      }
    }
    case 'creating': {
      return {
        ...state,
        listItems: updateListItem(listItems, action.listItem, {
          status: 'pending',
        }),
      }
    }
    case 'created': {
      return {
        ...state,
        listItems: updateListItem(listItems, action.listItem, {
          status: 'resolved',
          pending: null,
          data: action.listItemData,
        }),
      }
    }
    case 'create error': {
      return {
        ...state,
        listItems: updateListItem(listItems, action.listItem, {
          status: 'rejected',
          pending: null,
          error: action.error,
        }),
      }
    }
    case 'remove': {
      const listItem = listItems.find(li => li.data.id === action.listItemId)
      return {
        ...state,
        listItems: updateListItem(listItems, listItem, {
          pending: action.type,
        }),
      }
    }
    case 'removing': {
      return {
        ...state,
        listItems: updateListItem(listItems, action.listItem, {
          status: 'pending',
        }),
      }
    }
    case 'removed': {
      const {
        listItem: {ownerId, bookId},
      } = action
      return {
        ...state,
        listItems: listItems.filter(
          li => !(ownerId === li.ownerId && bookId === li.bookId),
        ),
      }
    }
    case 'remove error': {
      return {
        ...state,
        listItems: updateListItem(listItems, action.listItem, {
          status: 'rejected',
          pending: null,
          error: action.error,
        }),
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function updateListItem(listItems, listItem, updates) {
  const {ownerId, bookId} = listItem
  return listItems.map(li => {
    if (ownerId === li.ownerId && bookId === li.bookId) {
      return {
        ...li,
        ...updates,
      }
    }
    return li
  })
}

function ListItemProvider({children}) {
  const {user, isResolved: userIsResolved} = useUserState()
  const [state, dispatch] = React.useReducer(listItemReducer, initialState)
  const {listItems} = state

  // using useLayoutEffect to avoid a flash of the unauthenticated page
  React.useLayoutEffect(() => {
    if (!userIsResolved || !user || state.status === 'resolved') {
      return
    }
    dispatch({type: 'initialize'})
    listItemClient
      .readForUser(user.id)
      .then(
        data => dispatch({type: 'initialized', listItems: data.listItems}),
        error => dispatch({type: 'initialize error', error}),
      )
  }, [user, userIsResolved, state.status])

  // if the user logs out, then we should reset the state
  const hasStaleData = state.status === 'resolved' && !user
  React.useEffect(() => {
    if (hasStaleData) {
      dispatch({type: 'reset'})
    }
  }, [hasStaleData])

  // handle list items that need to be created
  const listItemsToCreate = listItems.filter(li => {
    return li.pending === 'create' && li.status !== 'pending'
  })
  React.useEffect(() => {
    if (!listItemsToCreate.length) {
      return
    }
    listItemsToCreate.forEach(listItem => {
      dispatch({type: 'creating', listItem})
      listItemClient
        .create(listItem.data)
        .then(
          data =>
            dispatch({type: 'created', listItem, listItemData: data.listItem}),
          error => dispatch({type: 'create error', listItem, error}),
        )
    })
  }, [listItemsToCreate])

  // handle list items that need to be removed
  const listItemsToRemove = listItems.filter(
    li => li.pending === 'remove' && li.status !== 'pending',
  )
  React.useEffect(() => {
    if (!listItemsToRemove.length) {
      return
    }
    listItemsToRemove.forEach(listItem => {
      dispatch({type: 'removing', listItem})
      listItemClient
        .remove(listItem.data.id)
        .then(
          () => dispatch({type: 'removed', listItem}),
          error => dispatch({type: 'remove error', listItem, error}),
        )
    })
  }, [listItemsToRemove])

  return (
    <ListItemStateContext.Provider value={state}>
      <ListItemDispatchContext.Provider value={dispatch}>
        {children}
      </ListItemDispatchContext.Provider>
    </ListItemStateContext.Provider>
  )
}

function useListItemDispatch() {
  const dispatch = React.useContext(ListItemDispatchContext)
  if (!dispatch) {
    throw new Error(
      `useListItemDispatch must be used within a ListItemProvider`,
    )
  }
  return dispatch
}

function useListItemState() {
  const state = React.useContext(ListItemStateContext)
  if (!state) {
    throw new Error(`useListItemState must be used within a ListItemProvider`)
  }
  const {status} = state
  const isPending = status === 'pending'
  const isResolved = status === 'resolved'
  const isRejected = status === 'rejected'
  return {
    ...state,
    isPending,
    isResolved,
    isRejected,
  }
}

function useSingleListItemState({bookId}) {
  const {user} = useUserState()
  const {listItems, isResolved: storeIsResolved} = useListItemState()
  if (!storeIsResolved) {
    return {isPending: true}
  }
  const listItem = listItems.find(
    li => li.bookId === bookId && li.ownerId === user.id,
  )
  if (!listItem) {
    return null
  }
  const isPending = listItem.status === 'pending'
  const isResolved = listItem.status === 'resolved'
  const isRejected = listItem.status === 'rejected'
  return {
    ...listItem,
    isPending,
    isResolved,
    isRejected,
  }
}

export {
  ListItemProvider,
  useListItemState,
  useSingleListItemState,
  useListItemDispatch,
}
