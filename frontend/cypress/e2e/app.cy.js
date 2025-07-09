describe('AI Learning App', () => {
    it('loads the homepage', () => {
      cy.visit('http://localhost:3000');
      cy.contains('AI Workplace Learning Chat UI');
    });
    it('can get AI concepts', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Get AI Concepts').should('be.visible').click();
      cy.get('pre', { timeout: 50000 }).should('exist').and('not.be.empty');
    });
  });