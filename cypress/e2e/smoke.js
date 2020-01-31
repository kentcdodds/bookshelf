import {userBuilder} from '../support/generate'

describe('smoke', () => {
  it('should allow a typical user flow', () => {
    const user = userBuilder()
    cy.visit('/')
    cy.findAllByText(/register/i).click()

    cy.findAllByRole('dialog').within(() => {
      cy.findAllByLabelText(/username/i).type(user.username)
      cy.findAllByLabelText(/password/i).type(user.password)
      cy.findByText(/register/i, {selector: 'button'}).click()
    })

    cy.findAllByRole('navigation').within(() => {
      cy.findAllByText(/discover/i).click()
    })

    cy.findAllByPlaceholderText(/search/i).type('Brandon{enter}')
  })
})
