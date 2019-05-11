import React from 'react'
import * as auth from '../utils/auth'

const UserStateContext = React.createContext()
const UserDispatchContext = React.createContext()

const initialState = {
  status: null, // null | 'pending' | 'resolved' | 'rejected'
  pending: null, // null | 'initialize' | 'authenticate' | 'register' | 'logout'
  error: null,
  user: null,
  username: null,
  password: null,
}

function userReducer(state, action) {
  switch (action.type) {
    // no need for an initialize action here because it happens
    // at the very start via React.useLayoutEffect in the provider
    case 'initializing': {
      return {...state, status: 'pending', pending: 'initialize'}
    }
    case 'initialized': {
      return {...state, status: 'resolved', pending: null, user: action.user}
    }
    case 'initialize error': {
      return {...state, status: 'rejected', pending: null, error: action.error}
    }
    case 'authenticate': {
      return {
        ...state,
        status: null,
        pending: action.type,
        username: action.username,
        password: action.password,
      }
    }
    case 'authenticating': {
      return {
        ...state,
        username: null,
        password: null,
        status: 'pending',
      }
    }
    case 'authenticated': {
      return {...state, status: 'resolved', user: action.user, pending: null}
    }
    case 'authenticate error': {
      return {...state, status: 'rejected', error: action.error, pending: null}
    }
    case 'register': {
      return {
        ...state,
        status: null,
        pending: action.type,
        username: action.username,
        password: action.password,
      }
    }
    case 'registering': {
      return {
        ...state,
        username: null,
        password: null,
        status: 'pending',
      }
    }
    case 'registered': {
      return {...state, status: 'resolved', user: action.user, pending: null}
    }
    case 'register error': {
      return {...state, status: 'rejected', error: action.error, pending: null}
    }
    case 'logout': {
      return {...state, pending: action.type}
    }
    case 'logged out': {
      return {...initialState}
    }
    case 'clear error': {
      return {...state, error: null, status: null}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useUserContextValue() {
  const [state, dispatch] = React.useReducer(userReducer, initialState)
  const {status, pending, error, user} = state
  const isPending = status === 'pending'
  const isResolved = status === 'resolved'
  const isRejected = status === 'rejected'
  const isAuthenticating = pending === 'authenticate'
  const isRegistering = pending === 'register'
  const isLoggingOut = pending === 'register'
  React.useDebugValue(isResolved ? user : isRejected ? error : pending)

  const hasUser = Boolean(user)
  // using useLayoutEffect so we don't see a flash of the home screen
  // before we start initializing if there's a user auth token.
  React.useLayoutEffect(() => {
    if (!hasUser && auth.getToken()) {
      dispatch({type: 'initializing'})
      auth.getUser().then(
        user => {
          dispatch({type: 'initialized', user})
        },
        error => dispatch({type: 'initialize error', error}),
      )
    }
  }, [hasUser])

  const {username, password} = state

  // authenticate
  React.useEffect(() => {
    if (!isAuthenticating || isPending) {
      return
    }
    dispatch({type: 'authenticating'})
    auth.login({username, password}).then(
      user => {
        dispatch({type: 'authenticated', user})
      },
      error => dispatch({type: 'authenticate error', error}),
    )
  }, [isAuthenticating, isPending, username, password])

  // register
  React.useEffect(() => {
    if (!isRegistering || isPending) {
      return
    }
    dispatch({type: 'registering'})
    auth.login({username, password}).then(
      user => {
        dispatch({type: 'registered', user})
      },
      error => dispatch({type: 'register error', error}),
    )
  }, [isRegistering, isPending, username, password])

  // logout
  React.useEffect(() => {
    if (!isLoggingOut || isPending) {
      return
    }
    auth.logout()
    dispatch({type: 'logged out'})
  }, [isLoggingOut, isPending])

  return [state, dispatch]
}

function UserProvider({children}) {
  const [state, dispatch] = useUserContextValue()
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  const state = React.useContext(UserStateContext)
  if (!state) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  const {status, pending} = state
  const isPending = status === 'pending'
  const isResolved = status === 'resolved'
  const isRejected = status === 'rejected'
  const isAuthenticating = pending === 'authenticate'
  const isRegistering = pending === 'register'
  const isInitializing = pending === 'initialize'
  const isLoggingOut = pending === 'register'
  return {
    ...state,
    isPending,
    isResolved,
    isRejected,
    isAuthenticating,
    isRegistering,
    isInitializing,
    isLoggingOut,
  }
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext)
  if (!context) {
    throw new Error(`useUserDispatch must be used within a UserProvider`)
  }
  return context
}

export {UserProvider, useUserState, useUserDispatch}
