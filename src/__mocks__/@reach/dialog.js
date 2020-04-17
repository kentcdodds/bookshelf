import React from 'react'

const Dialog = ({children, isOpen}) =>
  isOpen ? (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null

export {Dialog}
