describe('Comprehensive App Test', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('http://localhost:3000')
    
    // Wait for the app to load
    cy.get('body').should('be.visible')
  })

  it('should test all sidebar options and verify panels load correctly', () => {
    // Define all sidebar options to test
    const sidebarOptions = [
      { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
      { id: 'ai-concepts', name: 'AI Concepts', icon: '💡' },
      { id: 'micro-lessons', name: 'Micro-lessons', icon: '📚' },
      { id: 'recommendation', name: 'Recommendation', icon: '⭐' },
      { id: 'simulations', name: 'Simulations', icon: '🎮' },
      { id: 'web-search', name: 'Web Search', icon: '🌐' },
      { id: 'team-dynamics', name: 'Team Dynamics', icon: '👥' },
      { id: 'certifications', name: 'Certifications', icon: '🏆' },
      { id: 'coach', name: 'AI Career Coach', icon: '👨‍💼' },
      { id: 'skills-forecast', name: 'Skills Forecast', icon: '📊' },
      { id: 'saved-lessons', name: 'Saved Lessons', icon: '📦' }
    ]

    // Test each sidebar option
    sidebarOptions.forEach((option, index) => {
      cy.log(`Testing ${option.name} (${index + 1}/${sidebarOptions.length})`)
      
      // Click on the sidebar option
      cy.get(`[data-testid="sidebar-${option.id}"]`).click()
      
      // Wait for the panel to load
      cy.wait(500)
      
      // Verify the panel content is visible
      cy.get('main').should('be.visible')
      
      // Verify specific content for each section
      switch (option.id) {
        case 'dashboard':
          cy.get('h2').should('contain', 'Dashboard')
          break
        case 'ai-concepts':
          cy.get('h2').should('contain', 'AI Concepts')
          cy.get('button').should('contain', 'Generate Concepts')
          break
        case 'micro-lessons':
          cy.get('h2').should('contain', 'Micro-lesson')
          cy.get('input[placeholder*="topic"]').should('be.visible')
          break
        case 'recommendation':
          cy.get('h2').should('contain', 'Recommendation')
          cy.get('input[placeholder*="skill gap"]').should('be.visible')
          break
        case 'simulations':
          cy.get('h2').should('contain', 'Scenario Simulator')
          cy.get('button').should('contain', 'Start Simulation')
          break
        case 'web-search':
          cy.get('h2').should('contain', 'Web Search')
          cy.get('input[placeholder*="search"]').should('be.visible')
          break
        case 'team-dynamics':
          cy.get('h2').should('contain', 'Team Dynamics')
          cy.get('button').should('contain', 'Create New Team')
          break
        case 'certifications':
          cy.get('h2').should('contain', 'Certification Path Recommendation')
          cy.get('button').should('contain', 'Get Recommendations')
          break
        case 'coach':
          cy.get('h2').should('contain', 'AI Career Coach')
          cy.get('button').should('contain', 'Start Coaching')
          break
        case 'skills-forecast':
          cy.get('h2').should('contain', 'Skills Forecast')
          cy.get('textarea').should('be.visible')
          break
        case 'saved-lessons':
          cy.get('h2').should('contain', 'Saved Micro-lessons')
          break
      }
      
      // Verify the sidebar option is highlighted as active
      cy.get(`[data-testid="sidebar-${option.id}"]`).should('have.class', 'active')
      
      // Take a screenshot for visual verification
      cy.screenshot(`${option.id}-panel`)
    })
  })

  it('should test global search functionality', () => {
    // Test global search button
    cy.get('header').find('button').contains('🔍').click()
    
    // Verify search modal opens
    cy.get('[data-testid="global-search-modal"]').should('be.visible')
    
    // Test search input
    cy.get('input[placeholder*="Search all sections"]').type('dashboard')
    
    // Verify search results appear
    cy.get('[data-testid="search-results"]').should('be.visible')
    
    // Close search modal
    cy.get('body').type('{esc}')
    
    // Verify modal closes
    cy.get('[data-testid="global-search-modal"]').should('not.exist')
  })

  it('should test theme toggle functionality', () => {
    // Get initial theme
    cy.get('body').then(($body) => {
      const initialTheme = $body.hasClass('dark') ? 'dark' : 'light'
      
      // Click theme toggle
      cy.get('header').find('button').contains('🌙').click()
      
      // Verify theme changed
      if (initialTheme === 'light') {
        cy.get('body').should('have.class', 'dark')
      } else {
        cy.get('body').should('not.have.class', 'dark')
      }
    })
  })

  it('should test responsive design', () => {
    // Test mobile viewport
    cy.viewport('iphone-x')
    cy.get('body').should('be.visible')
    
    // Test tablet viewport
    cy.viewport('ipad-2')
    cy.get('body').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1920, 1080)
    cy.get('body').should('be.visible')
  })

  it('should test authentication flow', () => {
    // Check if sign-in button is visible
    cy.get('button').contains('Sign In').should('be.visible')
    
    // Note: We won't test actual Google Sign-In as it requires external authentication
    // This test verifies the sign-in UI is present
  })
}) 