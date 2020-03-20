import React from 'react'
import {render as rtlRender} from '@testing-library/react'
import AppProviders from 'context'

jest.mock('context/auth-context')

function render(ui, options) {
  function Wrapper({children}) {
    return <AppProviders>{children}</AppProviders>
  }

  return rtlRender(ui, {wrapper: Wrapper, ...options})
}

export * from '@testing-library/react'
export {render}
