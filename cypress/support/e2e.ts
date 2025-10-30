/**
 * EdPsych Connect World - Cypress support file for E2E tests
 * 
 * This file is loaded automatically before your test files run.
 * This is a great place to put global configuration and behavior
 * that modifies Cypress.
 */

// Import commands.js using ES2015 syntax:
import './commands';

// Import Cypress plugins
import 'cypress-axe';
import 'cypress-file-upload';
import 'cypress-wait-until';
import 'cypress-iframe';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in the command log to reduce noise
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error')) {
    return false;
  }
  return true;
});

const app = window.top;
if (app && app.document && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Preserve cookies between tests to maintain session
beforeEach(() => {
  const baseUrl = Cypress.config('baseUrl') || 'http://localhost:3002';
// Wait for login page to load before interacting
  cy.visit(`${baseUrl}/login`, { failOnStatusCode: false });
// Wait for login page to load before interacting
  cy.visit(`${baseUrl}/login`, { failOnStatusCode: false });
// Wait for login page to load before interacting
  cy.visit(`${baseUrl}/login`, { failOnStatusCode: false });
  cy.get('body', { timeout: 20000 }).then(($body) => {
    if ($body.text().includes('Sign In')) {
      cy.contains('Sign In').should('be.visible');
      cy.get('input[type="email"], input[name="email"]').should('exist').type('test@example.com');
      cy.get('input[type="password"], input[name="password"]').should('exist').type('password123');
      cy.get('button[type="submit"]').should('exist').click();
    } else {
      cy.log('Login page not found, skipping login setup');
    }
  });
});

// Log test name before each test
beforeEach(function() {
  cy.log(`**Running: ${this.currentTest.title}**`);
});

// Automatically log out after all tests
after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// Error handling
Cypress.on('uncaught:exception', (err) => {
  // Returning false here prevents Cypress from failing the test
  // when an uncaught exception happens in the application
  // Only do this if you're expecting certain errors that don't affect your test
  
  // Handle known React hydration issues
  if (err.message.includes('Hydration failed')) {
    return false;
  }
  
  // Let other errors fail the test
  return true;
});

// Configure accessibility testing
Cypress.Commands.add('checkA11y', (context = null, options = null) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Add custom command for testing authentication
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  // Use a direct API call for faster login
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      // Set the token in localStorage to simulate login
      cy.window().then((win) => {
        win.localStorage.setItem('token', response.body.token);
        if (response.body.refreshToken) {
          win.localStorage.setItem('refreshToken', response.body.refreshToken);
        }
      });
      
      // Set cookies if needed
      if (response.body.token) {
        cy.setCookie('token', response.body.token);
      }
      
      // Visit the protected route
      cy.visit('/dashboard');
    }
  });
});

// Log failed tests with screenshots
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
    cy.task('log', `Test failed: ${screenshotFileName}`);
  }
});