describe('Details Page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 8) {
          cy.wrap(el).click();
        }
      })
      .then((res) => {
        cy.url().should('include', '/pages/details');
      });
  });

  it('check Details edit', () => {

cy.get('[data-cy="edit-details-button"]').click()

cy.get('#mat-select-2 > .mat-select-trigger > .mat-select-arrow-wrapper').click()

cy.contains('[role="option"]', 'Security').click();

cy.get('[data-cy="details-edit-primary"]').type('1508 117 Bathurst street')

cy.get('[data-cy="details-edit-web"]').type('sample.com')

cy.get('#mat-input-5').type('0432473806')

cy.get('[data-cy="save-details-button"]').click()
  })

  it('check Details page',  () => {
    cy.get('.logo-text').invoke('text').then(txt => {
      expect(txt.trim()).equal('Details');
    });
    // cy.get('[data-cy="abn-field"]').should('be.visible');
    cy.get('[data-cy="abn-input"]').invoke('text').then(text => {
      expect(text.trim()).contains('12341234134');
    });
    cy.get('[data-cy="name-input"]').invoke('text').then(text => {
      expect(text.trim()).equal('Robert\'s Super Security Firm Pty Ltd');
    });
    cy.get('[data-cy="trading-name-input"]').invoke('text').then(text => {
      expect(text.trim()).equal('Super Security');
    });
    cy.get('[data-cy="entity-type-input"]').invoke('text').then(text => {
      expect(text.trim()).equal('Sole Trader');
    });

    cy.get('[data-cy="button-menu-Accreditations"] > .mat-button-wrapper').click();
    cy.get('[data-cy="add-accreditation-button"]').click();
    cy.get('[data-cy="header-drawer"]').invoke('text').then(text => {
      expect(text.trim()).equal('Add accreditations');
    });

    // cy.get('.mat-form-field-infix').click();
    // cy.get('mat-option').each((item, i) => {
    //   if (i === 0) {
    //     cy.wrap(item).click();
    //   }
    // });
    // cy.get('[data-cy="input-number"]').type('2');
    // cy.get('[data-cy="dob-input"]').type('16 November 2022');
    // cy.get('[data-cy="issued-by"]').type('Valeriy Zalujniy');
    // cy.get('[data-cy="save-accreditation"]').click()
    // cy.get('[data-cy="header-drawer"]').should('not.be.visible');
    // cy.get('.mat-expansion-panel').should('have.length', 2);

    // cy.get('#mat-tab-label-0-2').click();
    // cy.get('.mat-tab-label-active').invoke('text').then(txt => {
    //   expect(txt.trim()).equal('Subscription');
    // });
    // cy.get('[data-cy="subscription-header"]').should('be.visible');
  });
})
