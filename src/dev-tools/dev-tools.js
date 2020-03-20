/** @jsx jsx */
import {jsx} from '@emotion/core'

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
      <div ref={rootRef} id="dev-tools" className={show ? 'show' : null}>
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
