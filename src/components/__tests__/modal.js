import React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', () => {
  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label="Modal Label" title="Modal Title">
        <div>Modal Content</div>
      </ModalContents>
    </Modal>,
  )
  userEvent.click(screen.getByRole('button', {name: 'Open'}))
  const modal = within(screen.getByRole('dialog'))
  modal.getByRole('heading', {name: 'Modal Title'})
  userEvent.click(modal.getByRole('button', {name: /close/i}))
})
