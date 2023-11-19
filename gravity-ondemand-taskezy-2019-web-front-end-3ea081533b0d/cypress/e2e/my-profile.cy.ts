describe('My Profile Page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
  });

  it('check connections', () => {
    cy.get('[data-cy="user-menu-button"]').click();
    cy.get('#mat-menu-panel-1').should('be.visible');
    cy.get('[data-cy="button-profile"]').click();
    cy.get('[data-cy="connections-header"]').should('be.visible');
    cy.wait(1000);
    cy.get('[data-cy="invite"]').each((item, index) => {
      if (index === 0) {
        cy.contains('Accept').click();
      }
    });
    cy.wait(1000);
    cy.get('[data-cy="invite"]').should('have.length', 5);
  });
});
