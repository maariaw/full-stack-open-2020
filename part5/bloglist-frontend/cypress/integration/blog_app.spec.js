describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({
      username: 'Cycy',
      name: 'Cyril Cypress',
      password: 'HillSilly'
    })
    cy.createUser({
      username: 'NotCycy',
      name: 'Cyril Cypress',
      password: 'HillSilly'
    })
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
      cy.get('[data-cy=password]').type('notthepassword')
      cy.get('[data-cy=login]').click()

      cy.contains('Log in to Blogs application')
      cy.contains('Error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Cycy', password: 'HillSilly' })
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

    describe('When blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Cypress bypasses database',
          author: 'S. Neaky',
          url: 'still no websites'
        })
        cy.createBlog({
          title: 'This will be least liked blog',
          author: 'W. Orst',
          url: 'and no website'
        })
        cy.createBlog({
          title: 'This will be most liked blog',
          author: 'B. Est',
          url: 'still not a website'
        })
      })

      it('User can like a blog', function() {
        cy.contains('Cypress bypasses database')
          .parent().find('button').click()
        cy.get('[data-testid=likes]').as('likes')
        cy.get('@likes').contains('0')
        cy.get('@likes').find('button').click()
        cy.get('@likes').contains('1')
      })

      it('User can delete a blog they created', function() {
        cy.contains('Cypress bypasses database')
          .parent().find('button').click()
        cy.get('[data-cy=delete]').click()
        cy.visit('http://localhost:3000')
        cy.get('html').should('not.contain', 'Cypress bypasses database')
      })

      it('User cannot delete a blog someone else created', function() {
        cy.get('[data-cy=logout]').click()
        cy.request('POST', 'http://localhost:3003/api/login/', {
          username: 'NotCycy', password: 'HillSilly'
        }).then(response => {
          localStorage.setItem('loggedBlogsUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
        cy.contains('Cypress bypasses database')
          .parent().find('button').click()
        cy.get('[data-cy=delete]').should('not.exist')
      })

      it('The blogs are presented in order of most likes', function() {
        cy.contains('This will be most liked blog')
          .parent().find('button').click()
        cy.get('[data-testid=likes]').find('button').click()
        cy.get('[data-testid=likes]').contains('1')
        cy.get('[data-testid=likes]').find('button').click()
        cy.get('[data-testid=likes]').contains('2')
        cy.contains('This will be most liked blog')
          .parent().find('button').click()
        cy.contains('Cypress bypasses database')
          .parent().find('button').click()
        cy.get('[data-testid=likes]').find('button').click()
        cy.contains('Cypress bypasses database')
          .parent().find('button').click()
        cy.get('[data-cy=blog]').eq(0).should('contain', 'This will be most liked blog')
        cy.get('[data-cy=blog]').eq(1).should('contain', 'Cypress bypasses database')
        cy.get('[data-cy=blog]').eq(2).should('contain', 'This will be least liked blog')
      })
    })
  })
})