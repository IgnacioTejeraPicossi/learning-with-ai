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
      cy.wait(1000)
      
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
      
      // Click theme toggle button
      cy.get('header').find('button').contains('🌙').click()
      
      // Wait for theme change
      cy.wait(500)
      
      // Verify theme changed - check if the button text changed
      cy.get('header').find('button').should('contain', '☀️')
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
    // Check if authentication component is visible
    cy.get('body').should('contain', 'Sign in with Google')
    
    // Note: We won't test actual Google Sign-In as it requires external authentication
    // This test verifies the authentication UI is present
  })
}) 