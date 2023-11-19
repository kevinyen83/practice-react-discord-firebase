describe('Members Page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 9) {
          cy.wrap(el).click();
        }
      })
      .then((res) => {
        cy.url().should('include', '/pages/list-members');
      });
  });

  it('check members page', () => {
    cy.get('tr').should('have.length', 10);
  });

  it('check open the member', () => {
    cy.get('tr').each((item, index) => {
      if (index === 0) {
        cy.contains('Active').click();
        cy.get('.mat-drawer-inner-container').should('be.visible');
        cy.get('.edit-button').click();
        cy.get('[data-cy="role"]').should('be.visible');
        cy.get('[data-cy="department"]').should('be.visible');
        cy.get('[data-cy="role"]').click();
        cy.get('mat-option').each((it, inx) => {
          if (inx === 2) {
            cy.wrap(it).click();
          }
        })
        cy.get('[data-cy="department"]').clear();
        cy.get('[data-cy="department"]').type('Other Department');
        cy.get('[data-cy="save-button"]').should('be.visible');
        cy.get('[data-cy="save-button"]').click();
        cy.get('[data-cy="div-role"]').invoke('text').then(txt => {
          expect(txt.trim()).equal('Manager')
        });
        cy.get('[data-cy="div-department"]').invoke('text').then(txt => {
          expect(txt.trim()).equal('Other Department')
        })
        cy.get('[data-cy="close-icon"]').click();
        cy.get('tr').should('have.length', 10);
      }
    });
  })
});
