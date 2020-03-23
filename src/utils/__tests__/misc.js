import {formatDate} from '../misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date('October 18, 1988'))).toEqual('Oct 88')
})
