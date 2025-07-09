describe('AI Learning App', () => {
  it('loads the homepage', () => {
    cy.visit('http://localhost:3000');
    cy.contains('AI Workplace Learning Chat UI');
  });
  it('can get AI concepts', () => {
    cy.get('button').contains('Get AI Concepts').click();
    cy.contains('Concepts:');
  });
});

describe('Micro-lesson', () => {
  it('should fetch and display a micro-lesson', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[placeholder="Enter micro-lesson topic"]').type('agile sprint planning');
    cy.contains('Get Micro-lesson').click();
    cy.get('pre').should('exist').and('not.be.empty');
  });
});

describe('Recommendation', () => {
  it('should fetch and display a recommendation', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[placeholder="Enter skill gap for recommendation"]').type('team leadership');
    cy.contains('Get Recommendation').click();
    cy.get('pre').should('exist').and('not.be.empty');
  });
});

describe('Web Search', () => {
  it('should fetch and display a web search result', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[placeholder="Ask anything..."]').type('latest AI news');
    cy.contains('Search').click();
    cy.get('pre').should('exist').and('not.be.empty');
  });
});

describe('Scenario Simulator', () => {
  it('should start a scenario simulation', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[placeholder*="scenario type"]').type('angry customer');
    cy.contains('Start Simulation').click();
    cy.contains('Scenario Simulator');
    cy.contains('Customer:');
  });
});

describe('AI Concepts', () => {
  it('should fetch and display AI concepts', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Get AI Concepts').click();
    cy.get('pre').should('exist').and('not.be.empty');
  });
});
