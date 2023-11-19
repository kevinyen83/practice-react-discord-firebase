describe('Primary Account Page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
  });

  it('check alert window for create account', () => {
    cy.get('[data-cy="account-name"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal("Robert's Super Security Firm Pty Ltd");
      });
    cy.get('[data-cy="account-swap-button"]').click();
    cy.get('div[role="menu"]').should('be.visible');
    cy.get('[data-cy="create-primary-button"]').click();
    cy.get('fuse-confirmation-dialog').should('be.visible');
    cy.get('.mat-flat-button').click();
  });

  // it('go to ABN and check ABN', () => {
  //   cy.get('[data-cy="account-name"]')
  //     .invoke('text')
  //     .then((text) => {
  //       expect(text.trim()).equal("Robert's Super Security Firm Pty Ltd");
  //     });
  //   cy.get('[data-cy="account-swap-button"]').click();
  //   cy.get('div[role="menu"]').should('be.visible');
  //   cy.get('[data-cy="create-primary-button"]').click();
  //   cy.get('mat-dialog-container > app-create-account-modal')
  //     .invoke('text')
  //     .then((text) => {
  //       expect(text.trim()).contains('Create New Account');
  //     });
  //   cy.get('[data-cy="abn"]').type('99999999999');
  //   cy.get('[data-cy="search-button"]').click();
  //   cy.wait(1000);
  //   cy.get('[data-cy="abn-input"]').should('be.visible');
  //   cy.get('[data-cy="name-input"]').should('be.visible');
  //   cy.get('[data-cy="trading-name-input"]').should('be.visible');
  //   cy.get('[data-cy="entity-type-input"]').should('be.visible');
  //   cy.get('[data-cy="button-confirm"]').click();
  //   cy.wait(2000);
  //   cy.get('[data-cy="account-name"]')
  //     .invoke('text')
  //     .then((text) => {
  //       expect(text.trim()).equal('THE TRUSTEE FOR PSS FUND');
  //     });
  // });
});
