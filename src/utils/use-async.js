import React from 'react'

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

function useAsync() {
  const [{status, data, error}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    {status: 'idle', data: null, error: null},
  )

  const safeSetState = useSafeDispatch(setState)

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({status: 'pending'})
      return promise.then(
        data => {
          safeSetState({data, status: 'resolved'})
          return data
        },
        error => {
          safeSetState({status: 'rejected', error})
          return Promise.reject(error)
        },
      )
    },
    [safeSetState],
  )

  return {
    // these are here for convenience in matching what react-query
    // calls these things.
    isLoading: status === 'pending' || status === 'idle',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    isPending: status === 'pending',
    isRejected: status === 'rejected',
    isResolved: status === 'resolved',
    isIdle: status === 'idle',
    error,
    status,
    data,
    run,
  }
}

export default useAsync
