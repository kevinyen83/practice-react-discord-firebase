/// <reference types="cypress" />
// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    // customCommand(param: any): typeof customCommand;
    login(email: string, password: string): void;
  }
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    // customCommand(param: any): typeof customCommand;
    updateInMemoryDatabaseShifts(shift: string, newData: any, cb?: any);
  }
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    checkViewOfUser(user: string);
  }
}

// function customCommand(param: any): void {
//   console.warn(param);
// }

// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/');
  cy.wait(500);
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-button"]').click();
  cy.wait(2000);
});

Cypress.Commands.add('updateInMemoryDatabaseShifts', (shift, newData) => {
  cy.request({
    method: 'PUT', 
    url: `api/roster-tasks/${shift}`,
    body: newData
  }).then((response) => {
    console.log('---------', response.body);
    return response;
  });
});

Cypress.Commands.add('checkViewOfUser', (user) => {
  if (user && user === 'subscriber') {
    cy.get('[data-cy="action-buttons-details"]').should('be.visible')
  }
  if (user && user === 'client') {
    cy.get('[data-cy="tasks-section"]').should('not.exist');
    cy.get('[data-cy="client-name"]').should('be.visible');
    cy.get('[data-cy="shift-details-edit"]').should('not.exist');
  }
  if (user && user === 'supplier') {
    cy.get('[data-cy="tasks-section"]').should('exist');
    cy.get('[data-cy="client-name"]').should('not.exist');
    cy.get('[data-cy="shift-details-edit"]').should('be.visible');
  }
});
