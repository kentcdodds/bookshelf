import React from 'react'
import {UserProvider} from './user-context'
import {BooksProvider} from './books-context'

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
    <ProviderComposer contexts={[<UserProvider />, <BooksProvider />]}>
      {children}
    </ProviderComposer>
  )
}

export default AppProviders
