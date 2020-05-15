import React from 'react'
import {render} from 'test/app-test-utils'
import {NotFoundScreen} from '../not-found'

test('renders a go home link', async () => {
  const {getByText} = await render(<NotFoundScreen />)
  expect(getByText(/home/i).closest('a')).toHaveAttribute('href', '/')
})
