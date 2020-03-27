/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx, Global} from '@emotion/core'

import React from 'react'
import ReactDOM from 'react-dom'
import './dev-tools.css'
import * as reactQuery from 'react-query'
import {ReactQueryDevtoolsPanel} from 'react-query-devtools'

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
          {show ? <ReactQueryDevtoolsPanel /> : null}
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
export {install}

/*
eslint
  no-unused-expressions: "off",
*/
