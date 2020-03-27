import React from 'react'

const ListItemList = jest.fn(({noListItems, noFilteredListItems}) => (
  <>
    <div data-testid="no-list-items">{noListItems}</div>
    <div data-testid="no-filtered-list-items">{noFilteredListItems}</div>
  </>
))

export {ListItemList}
