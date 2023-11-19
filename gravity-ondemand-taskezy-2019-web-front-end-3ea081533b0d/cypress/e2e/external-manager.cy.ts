describe('Check External Manager', () => {
  beforeEach(() => {
    cy.login('darya5@gmail.com', '55555555');
    cy.url().should('include', '/welcome');
  });

  it('accept external manager', () => {
    cy.url().should('include', '/welcome');
    cy.get('[data-cy="view-connections"]').click();
    cy.get('[data-cy="arrow-right"]').click();
    cy.get('.card')
      .each((item, index) => {
        if (index === 1) {
          // cy.wrap(item).click();
          cy.wrap(item).find('.header-of-card').contains('Manager');
          cy.wrap(item).find('[data-cy="accept-invite"]').click();
          // cy.wrap(item).
          cy.get('.mat-flat-button').click();
        }
      })
      .then(() => {});
    

    
    // need to mock adding and uplaoding a file for the next section to be fully testable so stoppingit here
    // cy.get('[data-cy="button-confirm-verify"]').click();
    // cy.get('[data-cy="verifying-now-header"]')
    //   .invoke('text')
    //   .then((text) => {
    //     expect(text.trim()).equal('Verifying Now');
    //   });
    // cy.get('[data-cy="go-to-login-button"]').click();
    // cy.url().should('include', '/auth/login');
  });
});
