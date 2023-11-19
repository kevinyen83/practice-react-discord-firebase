describe('Incident Report Page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 7) {
          cy.wrap(el).click();
        }
      })
      .then((res) => {
        cy.url().should('include', '/pages/incident-reporting');
      });
  });

  it('check Incident Report page', () => {
    cy.get('[data-cy="logo-text"]').contains('Incident Report');
    cy.get('[data-cy="table-reporting"]').should('be.visible');
  })
});
