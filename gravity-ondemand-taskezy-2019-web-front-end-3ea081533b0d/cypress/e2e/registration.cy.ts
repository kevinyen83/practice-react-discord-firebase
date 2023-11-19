describe('Registration Page', () => {
    it('Registration Check Empty Form', () => {
        cy.visit('/auth/register');
        cy.get('[data-cy="register-button"]').should('be.disabled');
        cy.get('.mat-checkbox-inner-container').click();
        cy.get('[data-cy="register-button"]').should('be.disabled');
    });

    it('Registration Check Filling and Validation', () => {
        cy.visit('/auth/register');
        cy.get('[data-cy="register-button"]').should('be.disabled');
        cy.get('[data-cy="firstname-input"]').click();
        cy.get('[data-cy="firstname-input"]').type('testing user');
        cy.get('[data-cy="lastname-input"]').type('testing user');
        cy.get('[data-cy="email-input"]').type('thisisarealfakeemail');
        cy.get('[data-cy="password-input"]').type('test');        
        cy.get('[data-cy="invalid-email"]').invoke("text").then((text)=> {
            expect(text.trim()).equal("Please enter a valid email address");
          });
        cy.get('#ngx-mat-intl-tel-input-0').type('1234567897');
        cy.get('[data-cy="email-input"]').click();
        cy.get('[data-cy="invalid-mobile"]').invoke("text").then((text)=> {
            expect(text.trim()).equal("Invalid Number");
        });
        cy.get('[data-cy="firstname-input"]').click();
        cy.get('[data-cy="error-characters"]').invoke("text").then((text)=> {
            expect(text.trim()).equal("Password must be 8 characters");
        });
        cy.get('[data-cy="password-input"]').click();
        cy.get('[data-cy="password-input"]').clear();
        cy.get('[data-cy="password-input"]').type('test1234');
        cy.get('[data-cy="error-characters"]').should('not.exist');
        cy.get('.ngx-mat-tel-input-container').click();
        cy.get('#ngx-mat-intl-tel-input-0').clear();
        cy.get('#ngx-mat-intl-tel-input-0').type('0431 700 596');
        cy.get('[data-cy="invalid-mobile"]').should('not.exist');
        cy.get('[data-cy="email-input"]').click();
        cy.get('[data-cy="email-input"]').clear();
        cy.get('[data-cy="email-input"]').type('thisisarealfakeemail@email.com');
        cy.get('[data-cy="invalid-email"]').should('not.exist');

        cy.get('[data-cy="register-button"]').should('be.disabled');
        cy.get('.mat-checkbox-inner-container').click();
        cy.get('[data-cy="register-button"]').should('not.be.disabled');
        cy.get('[data-cy="register-button"]').click();
        // check where this should go and make sure its the right place
    });



});
describe('Tick Box Check', () => {


  it('Check the billing address has the same value when box is ticked, and has a different value when it is unticked', () => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('[data-cy="dashboard-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Dashboard');
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

      // cy.get(':nth-child(7) > :nth-child(2) > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger > .fuse-vertical-navigation-item-title-wrapper > .fuse-vertical-navigation-item-title > span').click()
      cy.get('[data-cy="edit-details-button"]').click()
      cy.get('#mat-input-2').type('1508 115 Bathurst Street Sydney 2000 NSW').click()
      cy.get('.mat-checkbox-input').should('have.attr', 'aria-checked', 'true');
      cy.get('#mat-input-3').should('have.value', '1508 115 Bathurst Street Sydney 2000 NSW');
      cy.get('.mat-checkbox-inner-container').click()
      cy.get('.mat-checkbox-input').should('have.attr', 'aria-checked', 'false');
       cy.get('#mat-input-3').clear()
      cy.get('#mat-input-3').type('not the same address')
      cy.get('#mat-input-2').should('have.value', '1508 115 Bathurst Street Sydney 2000 NSW');
      cy.get('#mat-input-3').should('have.value', 'not the same address');
      cy.get('.mat-checkbox-inner-container').click()
      cy.get('#mat-input-3').should('have.value', '1508 115 Bathurst Street Sydney 2000 NSW');
  });
});
