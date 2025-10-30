/**
 * E2E tests for login functionality
 */

describe('Login Page', () => {
  beforeEach(() => {
    const baseUrl = Cypress.config('baseUrl') || 'http://localhost:3002';
    cy.visit(`${baseUrl}/login`, { failOnStatusCode: false });
  });

  it('should display the login form', () => {
    cy.get('h1').should('contain.text', 'Sign In');
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist').and('contain.text', 'Sign In');
  });

  it('should show validation errors for empty form submission', () => {
    cy.get('button[type="submit"]').click();
    cy.get('form').contains('Email is required').should('be.visible');
    cy.get('form').contains('Password is required').should('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for the error message
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should redirect to dashboard after successful login', () => {
    // Intercept the API call to mock a successful response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      }
    }).as('loginRequest');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for the API call
    cy.wait('@loginRequest');
    
    // Check redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Check that user info is displayed
    cy.contains('Test User').should('be.visible');
  });

  it('should have a "Forgot Password" link', () => {
    cy.contains('a', 'Forgot Password?')
      .should('be.visible')
      .should('have.attr', 'href')
      .and('include', '/forgot-password');
  });

  it('should have a registration link for new users', () => {
    cy.contains('a', 'Create an account')
      .should('be.visible')
      .should('have.attr', 'href')
      .and('include', '/register');
  });

  it('should maintain accessibility standards', () => {
    // Check for accessibility violations
    cy.injectAxe();
    cy.checkA11y();
  });

  context('Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('form').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('form').should('be.visible');
    });

    it('should display correctly on desktop', () => {
      cy.viewport(1280, 800);
      cy.get('form').should('be.visible');
    });
  });
});