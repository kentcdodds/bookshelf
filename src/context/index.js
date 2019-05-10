import React from 'react'
import {AuthProvider} from './auth-context'

function ProviderComposer({contexts, children}) {
  return contexts.reduceRight(
    (c, parent) =>
      React.cloneElement(parent, {
        children: c,
      }),
    children,
  )
}

function AppProviders({children}) {
  return (
    <ProviderComposer contexts={[<AuthProvider />]}>
      {children}
    </ProviderComposer>
  )
}

export default AppProviders
