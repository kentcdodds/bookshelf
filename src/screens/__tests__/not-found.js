import React from 'react'
import {render} from '@testing-library/react'
import NotFound from '../not-found'

test('renders a go home link', () => {
  const {getByText} = render(<NotFound />)
  expect(getByText(/home/i).closest('a')).toHaveAttribute('href', '/')
})
