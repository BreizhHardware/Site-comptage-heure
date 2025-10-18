describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('input[id="email"]').type('test@example.com')
    cy.get('input[id="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
