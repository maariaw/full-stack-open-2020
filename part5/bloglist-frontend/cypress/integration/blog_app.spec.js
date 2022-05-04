describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'Cycy',
      name: 'Cyril Cypress',
      password: 'HillSilly'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to Blogs application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('[data-cy=username]').type('Cycy')
      cy.get('[data-cy=password]').type('HillSilly')
      cy.get('[data-cy=login]').click()

      cy.contains('Cyril Cypress logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('[data-cy=username]').type('Cycy')
      cy.get('[data-cy=password]').type('Hillsilly')
      cy.get('[data-cy=login]').click()

      cy.contains('Log in to Blogs application')
      cy.contains('Error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})