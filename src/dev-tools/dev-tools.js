/** @jsx jsx */
import {jsx, Global} from '@emotion/core'
import * as colors from 'styles/colors'
import * as mq from 'styles/media-queries'

import React from 'react'
import ReactDOM from 'react-dom'
import {FaTools} from 'react-icons/fa'
import {Tooltip} from '@reach/tooltip'
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
          bottom: -15,
          left: 0,
          right: 0,
          label: {
            margin: 0,
            color: 'rgb(216, 221, 227)',
          },
          'input, select': {
            background: 'rgb(20, 36, 55)',
            border: '2px solid rgb(28, 46, 68)',
            borderRadius: 5,
            color: 'white',
            fontWeight: '600',
            padding: '5px',
            '::placeholder': {
              color: 'rgba(255,255,255,0.3)',
            },
            ':focus': {
              outlineColor: colors.indigo,
              borderColor: colors.indigo,
              outline: '1px',
            },
          },
          button: {
            borderRadius: 5,
            background: colors.indigo,
            ':hover': {
              background: colors.indigoDarken10,
            },
            border: 0,
            color: colors.gray,
          },
        }}
      >
        <div
          ref={rootRef}
          css={[
            {
              background: 'rgb(11, 21, 33)',
              opacity: '0',
              color: 'white',
              padding: '20px',
              boxSizing: 'content-box',
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
          <Tooltip label="Toggle Persist DevTools">
            <button
              css={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.2rem',
                border: 'none',
                padding: '10px 20px',
                background: 'none',
                marginTop: -60,
                position: 'absolute',
                backgroundColor: 'rgb(11,21,33) !important',
                overflow: 'hidden',
                svg: {
                  width: 20,
                  marginRight: 8,
                  color: persist ? 'white' : 'rgba(255,255,255,0.7)',
                },
                '::before': {
                  content: '""',
                  position: 'absolute',
                  height: 4,
                  width: '100%',
                  left: 0,
                  top: 0,
                  background: persist ? colors.yellow : 'transparent',
                },
              }}
              onClick={toggleShow}
            >
              <FaTools />
              Bookshelf DevTools
            </button>
          </Tooltip>
          {show ? (
            <div>
              <div
                css={{
                  display: 'grid',
                  gridTemplateColumns: '350px auto',
                  [mq.small]: {
                    gridTemplateColumns: '1fr',
                  },
                }}
              >
                <div
                  css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'repeat(auto-fill, minmax(40px, 40px) )',
                    gridGap: '0.5rem',
                    marginRight: '1.5rem',
                  }}
                >
                  <ClearLocalStorage />
                  <EnableDevTools />
                  <FailureRate />
                  <RequestMinTime />
                  <RequestVarTime />
                </div>

                <RequestFailUI />
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

function ClearLocalStorage() {
  function clear() {
    window.localStorage.clear()
    window.location.assign(window.location)
  }
  return <button onClick={clear}>Purge Database</button>
}

function FailureRate() {
  const [failureRate, setFailureRate] = useLocalStorageState(
    '__bookshelf_failure_rate__',
    0,
  )

  const handleChange = event => setFailureRate(Number(event.target.value) / 100)

  return (
    <div
      css={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
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

function EnableDevTools() {
  const [enableDevTools, setEnableDevTools] = useLocalStorageState(
    'dev-tools',
    process.env.NODE_ENV === 'development',
  )

  const handleChange = event => setEnableDevTools(event.target.checked)

  return (
    <div
      css={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <input
        css={{marginRight: 6}}
        checked={enableDevTools}
        type="checkbox"
        onChange={handleChange}
        id="enableDevTools"
      />
      <label htmlFor="enableDevTools">Enable DevTools by default</label>
    </div>
  )
}

function RequestMinTime() {
  const [minTime, setMinTime] = useLocalStorageState(
    '__bookshelf_min_request_time__',
    400,
  )

  const handleChange = event => setMinTime(Number(event.target.value))

  return (
    <div
      css={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
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
    400,
  )

  const handleChange = event => setVarTime(Number(event.target.value))

  return (
    <div
      css={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
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

function RequestFailUI() {
  const [failConfig, setFailConfig] = useLocalStorageState(
    '__bookshelf_request_fail_config__',
    [],
  )

  function handleRemoveClick(index) {
    setFailConfig(c => [...c.slice(0, index), ...c.slice(index + 1)])
  }

  function handleSubmit(event) {
    event.preventDefault()
    const {
      requestMethod: {value: requestMethod},
      urlMatch: {value: urlMatch},
    } = event.target.elements
    setFailConfig(c => [...c, {requestMethod, urlMatch}])
  }

  return (
    <div
      css={{
        borderLeft: '1px solid rgb(20,36,55)',
        paddingLeft: '1.5rem',
        [mq.small]: {
          border: 'none',
          paddingLeft: 0,
          paddingTop: '1.5rem',
        },
      }}
    >
      <span
        css={{
          fontSize: 15,
          fontWeight: 600,
          color: colors.indigoLighten80,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Request failures:
      </span>
      <div
        css={{
          display: 'flex',
          width: '100%',
        }}
      >
        <form
          onSubmit={handleSubmit}
          css={{
            display: 'grid',
            gridTemplateRows: 'repeat(auto-fill, minmax(40px, 85px) )',
            maxWidth: 300,
            width: '100%',
            marginRight: '1rem',
          }}
        >
          <div
            css={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <label htmlFor="requestMethod">Method:</label>
            <select id="requestMethod" required>
              <option>Select</option>
              <option value="ALL">ALL</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div css={{width: '100%'}}>
            <label css={{display: 'block'}} htmlFor="urlMatch">
              URL Match:
            </label>
            <input
              autoComplete="off"
              css={{width: '100%', marginTop: 4}}
              id="urlMatch"
              type="text"
              required
              placeholder="/api/list-items/:listItemId"
            />
          </div>
          <div>
            <button css={{padding: '6px 16px'}} type="submit">
              + Add
            </button>
          </div>
        </form>
        <ul
          css={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            width: '100%',
            maxWidth: 300,
            paddingBottom: '2rem',
          }}
        >
          {failConfig.map(({requestMethod, urlMatch}, index) => (
            <li
              key={index}
              css={{
                padding: '6px 10px',
                borderRadius: 5,
                margin: '5px 0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgb(20,36,55)',
              }}
            >
              {requestMethod}: {urlMatch}{' '}
              <button
                css={{
                  opacity: 0.6,
                  ':hover': {opacity: 1},
                  fontSize: 13,
                  background: 'rgb(11, 20, 33) !important',
                }}
                onClick={() => handleRemoveClick(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
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
