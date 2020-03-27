import React from 'react'

const Dialog = ({children, isOpen}) =>
  isOpen ? <div aria-modal="true">{children}</div> : null

export {Dialog}
