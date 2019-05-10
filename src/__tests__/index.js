import React from 'react'
import {render} from 'react-testing-library'

test('works', () => {
  const {container} = render(<div>hi</div>)
  expect(container.firstChild).toHaveTextContent('hi')
})
