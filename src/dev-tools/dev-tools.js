/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx, Global} from '@emotion/core'

import React from 'react'
import ReactDOM from 'react-dom'
import './dev-tools.css'
import * as reactQuery from 'react-query'
// pulling the development thing directly because I'm not worried about
// bundle size since this won't be loaded in prod unless the query string/localStorage key is set
import {ReactQueryDevtoolsPanel} from 'react-query-devtools/dist/react-query-devtools.development'

function install() {
  // add some things to window to make it easier to debug
  window.reactQuery = reactQuery

  const requireDevToolsLocal = require.context(
    './',
    false,
    /dev-tools\.local\.js/,
  )
  const local = requireDevToolsLocal.keys()[0]
  if (local) {
    requireDevToolsLocal(local).default
  }

  function DevTools() {
    const rootRef = React.useRef()
    const [hovering, setHovering] = React.useState(false)
    const [persist, setPersist] = React.useState(false)
    const show = persist || hovering
    const toggleShow = () => setPersist(v => !v)
    React.useEffect(() => {
      function updateHoverState(event) {
        setHovering(rootRef.current?.contains(event.target) ?? false)
      }
      document.body.addEventListener('mousemove', updateHoverState)
      return () =>
        document.body.removeEventListener('mousemove', updateHoverState)
    }, [])
    return (
      <div
        css={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div
          ref={rootRef}
          css={[
            {
              background: 'black',
              opacity: '0',
              color: 'white',
              padding: '20px',
              height: '60px',
              width: '100%',
              transition: 'all 0.3s',
              overflow: 'scroll',
            },
            show
              ? {
                  height: '50vh',
                  width: '100%',
                  opacity: '1',
                }
              : null,
          ]}
        >
          <button
            css={{
              border: 'none',
              background: 'none',
              marginBottom: 10,
            }}
            onClick={toggleShow}
          >
            🎛
          </button>
          {show ? (
            <div>
              <div>
                <FailureRate />
                <RequestMinTime />
                <RequestVarTime />
              </div>
              <ReactQueryDevtoolsPanel />
            </div>
          ) : null}
        </div>
        {show ? (
          <Global
            styles={{
              '#root': {
                marginBottom: '50vh',
              },
            }}
          />
        ) : null}
      </div>
    )
  }
  // add dev tools UI to the page
  const devToolsRoot = document.createElement('div')
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(<DevTools />, devToolsRoot)
}

function FailureRate() {
  const [failureRate, setFailureRate] = useLocalStorageState(
    '__bookshelf_failure_rate__',
    0.1,
  )

  const handleChange = event => setFailureRate(Number(event.target.value) / 100)

  return (
    <div>
      <label htmlFor="failureRate">Request Failure Percentage: </label>
      <input
        css={{marginLeft: 6}}
        value={failureRate * 100}
        type="number"
        min="0"
        max="100"
        step="10"
        onChange={handleChange}
        id="failureRate"
      />
    </div>
  )
}

function RequestMinTime() {
  const [minTime, setMinTime] = useLocalStorageState(
    '__bookshelf_min_request_time__',
    300,
  )

  const handleChange = event => setMinTime(Number(event.target.value))

  return (
    <div>
      <label htmlFor="minTime">Request min time (ms): </label>
      <input
        css={{marginLeft: 6}}
        value={minTime}
        type="number"
        step="100"
        min="0"
        max={1000 * 60}
        onChange={handleChange}
        id="minTime"
      />
    </div>
  )
}

function RequestVarTime() {
  const [varTime, setVarTime] = useLocalStorageState(
    '__bookshelf_variable_request_time__',
    200,
  )

  const handleChange = event => setVarTime(Number(event.target.value))

  return (
    <div>
      <label htmlFor="varTime">Request variable time (ms): </label>
      <input
        css={{marginLeft: 6}}
        value={varTime}
        type="number"
        step="100"
        min="0"
        max={1000 * 60}
        onChange={handleChange}
        id="varTime"
      />
    </div>
  )
}

/**
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
  }, [key])

  React.useEffect(() => {
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

export {install}

/*
eslint
  no-unused-expressions: "off",
*/
