import React from 'react'
import {render, screen, within, userEvent} from '@testing-library/react'
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
  await userEvent.click(screen.getByRole('button', {name: 'Open'}))

  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label)
  const inModal = within(screen.getByRole('dialog'))
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()

  await userEvent.click(inModal.getByRole('button', {name: /close/i}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
