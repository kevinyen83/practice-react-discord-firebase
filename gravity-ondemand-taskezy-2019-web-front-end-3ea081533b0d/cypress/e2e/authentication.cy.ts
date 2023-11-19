describe('Authentification Page', () => {
  it('Authentification Login Email: True, Mobile: True, ID: False', () => {
    cy.login('darya2@gmail.com', '22222222');
    cy.get('[data-cy="id-check-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('You are almost there!');
      });
  });

  it('Authentification Login Email: True, Mobile: False, ID: False', () => {
    cy.login('darya3@gmail.com', '33333333');
    cy.get('[data-cy="mobile-verification-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Mobile verification');
      });
  });

  it('Authentification Login Email: False, Mobile: False, ID: False', () => {
    cy.login('darya4@gmail.com', '44444444');
    cy.get('[data-cy="email-verification-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Email verification');
      });
  });

  it('Authentification Login Email: True, Mobile: True, ID: True, Accounts: 0', () => {
    cy.login('darya5@gmail.com', '55555555');
    cy.url().should('include', '/welcome');
  });

  it('Authentification Login Email: True, Mobile: True, ID: True, Accounts: More than 0', () => {
    cy.login('darya@gmail.com', '11111111');
    cy.url().should('include', '/home');
    cy.get('[data-cy="account-name"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal("Robert's Super Security Firm Pty Ltd");
      });
  });
});

//use this to log into all other tests as required.
// cy.login('darya@gmail.com', '11111111');
