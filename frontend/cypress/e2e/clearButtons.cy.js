describe('Clear Buttons', () => {
    it('should clear AI Concepts result', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Get AI Concepts').click();
      cy.get('pre').should('exist');
      cy.contains('Clear').click();
      cy.get('pre').should('not.exist');
    });
  
    it('should clear Micro-lesson input and result', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Enter micro-lesson topic"]').type('agile');
      cy.contains('Get Micro-lesson').click();
      cy.get('pre').should('exist');
      cy.contains('Micro-lesson').parent().contains('Clear').click();
      cy.get('input[placeholder="Enter micro-lesson topic"]').should('have.value', '');
      cy.get('pre').should('not.exist');
    });
  
    it('should clear Recommendation input and result', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Enter skill gap for recommendation"]').type('leadership');
      cy.contains('Get Recommendation').click();
      cy.get('pre').should('exist');
      cy.contains('Recommendation').parent().contains('Clear').click();
      cy.get('input[placeholder="Enter skill gap for recommendation"]').should('have.value', '');
      cy.get('pre').should('not.exist');
    });
  });


