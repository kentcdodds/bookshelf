import React from 'react'

module.exports = {
  Dialog: ({children, isOpen}) =>
    isOpen ? <div aria-modal="true">{children}</div> : null,
}
