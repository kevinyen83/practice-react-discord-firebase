describe('utilWidgetTest', () => {


  it('check UtilWidget number', () => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('[data-cy="dashboard-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Dashboard');
      });


    // cy.get('[data-cy="total-tasks-total-resource-utilisation"]').contains('4')
    // cy.get('#SvgjsPath4328[val="1"]')
    // cy.get('#SvgjsPath4334[val="1"]')
    // cy.get('#SvgjsPath4340[val="2"]')
    cy.get(':nth-child(4) > :nth-child(2) > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger').click()

    cy.get('[data-cy="create-shift"]').click()


cy.get('[data-cy="number-field"]').eq(0).type('1');

cy.get('[data-cy="search-button"]').eq(0).click()

cy.get('.mat-cell').first().click();
cy.get('[data-cy="select-button"]').click()

cy.get('[data-cy="save-release"]').click()
cy.wait(3000)
cy.get(':nth-child(2) > fuse-vertical-navigation-basic-item.ng-star-inserted > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger').click()
cy.get('[data-cy="total-tasks-total-resource-utilisation"]').contains('1')

cy.get(':nth-child(4) > :nth-child(2) > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger').click()

cy.get('[data-cy="create-shift"]').click()



cy.get('[data-cy="number-field"]').eq(0).type("1")

cy.get('[data-cy="search-button"]').eq(0).click()

cy.get('.mat-cell .mat-checkbox').first().click();
cy.get('[data-cy="select-button"]').click()

cy.get('[data-cy="save-release"]').click()
cy.wait(3000)
cy.get(':nth-child(2) > fuse-vertical-navigation-basic-item.ng-star-inserted > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger').click()
cy.get('[data-cy="total-tasks-total-resource-utilisation"]').contains('2')


cy.get(':nth-child(4) > :nth-child(2) > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger').click()

cy.get('[data-cy="create-shift"]').click()



cy.get('[data-cy="number-field"]').eq(0).type("1")

cy.get('[data-cy="search-button"]').eq(0).click()

cy.get('.mat-cell').first().click();
cy.get('[data-cy="select-button"]').click()

cy.get('[data-cy="save-release"]').click()
cy.wait(3000)
cy.get(':nth-child(2) > fuse-vertical-navigation-basic-item.ng-star-inserted > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger').click()
cy.get('[data-cy="total-tasks-total-resource-utilisation"]').contains('3')


  });
});

