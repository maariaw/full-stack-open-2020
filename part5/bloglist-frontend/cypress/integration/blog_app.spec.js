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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login/', {
        username: 'Cycy', password: 'HillSilly'
      }).then(response => {
        localStorage.setItem('loggedBlogsUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('Add new blog').click()
      cy.get('[data-cy=title]').type('Cypress can create blogs')
      cy.get('[data-cy=author]').type('R. Obot')
      cy.get('[data-cy=url]').type('not a website')
      cy.get('[data-cy=createblog]').click()
      cy.contains('Add new blog').click()
      cy.visit('http://localhost:3000')
      cy.contains('Cypress can create blogs')
    })

    describe('When a blog exists', function() {
      beforeEach(function() {
        cy.request({
          url: 'http://localhost:3003/api/blogs/',
          method: 'POST',
          body: {
            title: 'Cypress bypasses database',
            author: 'S. Neaky',
            url: 'still no websites'
          },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogsUser')).token}`
          }
        })
        cy.visit('http://localhost:3000')
      })

      it('User can like a blog', function() {
        cy.contains('Cypress bypasses database')
          .parent().find('button').click()
        cy.contains('Cypress bypasses database')
          .parent().get('[data-testid=likes]').as('likes')
        cy.get('@likes').contains('0')
        cy.get('@likes').find('button').click()
        cy.get('@likes').contains('1')
      })
    })
  })
})