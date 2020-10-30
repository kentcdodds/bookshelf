import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', async () => {
  const label = 'Modal Label'
  const title = 'Modal Title'
  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>Modal Content</div>
      </ModalContents>
    </Modal>,
  )
  userEvent.click(screen.getByRole('button', {name: 'Open'}))

  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label)
  const inModal = within(screen.getByRole('dialog'))
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()

  userEvent.click(inModal.getByRole('button', {name: /close/i}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
