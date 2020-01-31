import React from 'react'

module.exports = ({children, label}) => (
  <div data-tooltip-label={label}>{children}</div>
)
