describe('Scenario Simulator', () => {
    it('should start a simulation and make a user choice', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder*="scenario type"]').type('late delivery');
      cy.contains('Start Simulation').click();
  
      // Wait for customer message and choices to appear
      cy.contains('Customer:').should('exist');
      cy.get('button').contains(/.+/).first().click(); // Click the first choice
  
      // Should show feedback
      cy.contains('Feedback:').should('exist');
  
      // Click Next to proceed
      cy.contains('Next').click();
  
      // Should show next customer message or simulation complete
      cy.get('div').then($div => {
        if ($div.text().includes('Simulation complete!')) {
          cy.contains('Simulation complete!').should('exist');
        } else {
          cy.contains('Customer:').should('exist');
        }
      });
    });
  
    it('should restart the simulation', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder*="scenario type"]').type('product defect');
      cy.contains('Start Simulation').click();
      cy.contains('Restart').click();
      cy.get('input[placeholder*="scenario type"]').should('have.value', '');
    });
  });


