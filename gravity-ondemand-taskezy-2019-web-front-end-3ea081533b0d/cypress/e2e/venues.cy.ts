import * as moment from 'moment';

describe('Venues page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 2) {
          cy.wrap(el).click();
        }
      })
      .then(() => {
        cy.url().should('include', '/pages/list-venues');
      });
  });

  it('check venues page', () => {
    cy.get('[data-cy="logo-text"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Venues');
      });
  });

  it('check add venue', () => {
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 2) {
          cy.wrap(el).click();
        }
      })
      .then(() => {
        cy.url().should('include', '/pages/list-venues');
        cy.get('[data-cy="logo-text"]')
          .invoke('text')
          .then((text) => {
            expect(text.trim()).equal('Venues');
          });
      });
    cy.get('[data-cy="add-venue"]').click();
    cy.get('[data-cy="map-false"]').should('exist');
    cy.get('[data-cy="venue-name-input"]').type('Venue Name 1');
    cy.get('[data-cy="venue-address-input"]').click();
    cy.get('[data-cy="venue-address-input"]').clear();
    cy.get('[data-cy="venue-address-input"]').type('121 Pitt Street, Sydney NSW, Australia');
    cy.get('[data-cy="venue-stations-input"]')
      .click()
      .then((res) => {
        cy.get('mat-option').each((item, index) => {
          if (index === 0) {
            cy.wrap(item).click();
          }
        });
      });
    cy.get('.cdk-overlay-backdrop').click();
    cy.get('[data-cy="venue-type-select"]')
      .click()
      .then((res) => {
        cy.get('mat-option').each((item, index) => {
          if (index === 0) {
            cy.wrap(item).click();
            cy.get('[data-cy="licence-number"]').should('be.visible');
            cy.get('[data-cy="venue-type-select"]').click();
          }
          if (index === 1) {
            cy.wrap(item).click({ force: true });
          }
        });
      });
      cy.get('[data-cy="sign-on-distance"]').click();
      cy.get('[data-cy="sign-on-distance"]').clear();
      cy.get('[data-cy="sign-on-distance"]').type('150');
      cy.get('[data-cy="save-button"]').click();
  });

  it('check created venue', () => {
    cy.get('[data-cy="venue"]').click();
    cy.get('[data-cy="button-menu-Engagement Details & Documents"]').click();
    cy.get('[data-cy="resource-rates-header"]').should('be.visible');
    cy.get('[data-cy="resource-rates-header"]').contains('Resource Rates');
    cy.get('[data-cy="resource-rates-add-new-rate-button"]').click();
    cy.get('[data-cy="resource-rate-header"]').should('be.visible');
    cy.get('[data-cy="resource-rate-header"]').contains('Add New Resource Rate');
    cy.get('[data-cy="resource-rate-input-0"]').type('-3000');
    cy.get('[data-cy="resource-rate-input-0"]').invoke('val').then(value => {
      expect(value).equal('$ 30.00');
    });
  });

  it('check Contract Dates', () => {
    cy.get('[data-cy="venue"]').click();
    cy.get('[data-cy="button-menu-Engagement Details & Documents"]').click();
    cy.get('[data-cy="contract-details-header"]').contains('Contract Details');
    cy.get('[data-cy="contract-details-edit"]').click();
    cy.get('[data-cy="contract-start-date-input"]').should('be.visible');
    cy.get('[data-cy="contract-start-date-input"]').clear();
    cy.get('[data-cy="contract-start-date-input"]').type('30/07/2023');
    cy.get('[data-cy="contract-review-date"]').should('be.visible');
    cy.get('[data-cy="contract-review-date"]').clear();
    cy.get('[data-cy="contract-review-date"]').type('05/07/2023');
    cy.get('[data-cy="mat-error-start"]').should('be.visible');
    cy.get('[data-cy="mat-error-start"]').contains('End can not be before the start');

    cy.get('[data-cy="contract-review-date"]').clear();
    let new_date_review = moment().format('DD/MM/YYYY');
    cy.get('[data-cy="contract-review-date"]').type(new_date_review);
    cy.get('[data-cy="toggle-review-date"]').click();
    cy.get('.mat-calendar-body').find('tr').each((tr, i) => {
      if (i === 2) {
        cy.wrap(tr).find('td[data-mat-col="2"]').click();
      }
    });
    cy.get('[data-cy="mat-error-start"]').should('not.exist');
  });

  it('check venue managers for exist venue', () => {
    cy.get('[data-cy="venue"]').click();
    cy.get('[data-cy="button-menu-Venue manager"]').click();
    cy.get('.mat-row').should('have.length', 1);
    cy.get('[data-cy="venue-managers-header"]').contains('Venue managers');
    cy.get('[data-cy="add-venue-manager"]').click();
    cy.get('[data-cy="table-managers"]').should('exist');
    cy.get('.mat-row').each((row, i) => {
      if (i === 1) {
        cy.wrap(row).find('mat-checkbox').click();
        cy.get('.mat-checkbox-checked').should('exist');
        cy.get('[data-cy="save-venue"]').click();
      }
    });
    cy.get('[data-cy="table-managers"]').should('not.exist');
    cy.get('.mat-row').should('have.length', 2);
  });

  it('check edit Shift Role', () => {
    cy.get('[data-cy="venue"]').click();
    cy.get('[data-cy="button-menu-Shift Roles"]').click();
    cy.get('[data-cy="shift-roles-header"]').contains('Shift Roles');
    cy.get('tr').each((res, i) => {
      if (i === 0) {
        cy.get('tr').find('td').each((el, idx) => {
          if (idx === 6) {
            cy.get('tr').find('td').find('mat-icon').click();
            cy.get('.mat-menu-content').find('button').click();
            cy.get('[data-cy="header-role"]').invoke('text').then(text => {
              expect(text.trim()).equal('edit Shift Role');
            });
            cy.get('[data-cy="resource-rate-shift-role"]').clear();
            cy.get('[data-cy="resource-rate-shift-role"]').type('new name of role');
            cy.get('[data-cy="next-button"]').click();
            cy.get('[data-cy="licences-text"]').invoke('text').then(text => {
              expect(text.trim()).equal('Select accreditations that will be attached to the Role');
            });
            cy.get('[data-cy="accreditation-checkbox"]').should('have.class', 'mat-checkbox-checked');
            cy.get('[data-cy="save-button"]').click();
            cy.get('.mat-flat-button').find('span').contains('Yes').click();
            cy.get('body').click(0, 0);
            cy.get('[data-cy="header-role"]').should('not.exist');
          }
        });
      }
    });
    // cy.get('tr').each((res, i) => {
    //   if (i === 0) {
    //     cy.get('tr').find('td').eq(0).contains('new name of role')
    //     cy.get('tr').find('td').eq(1).contains('Security')
    //   }
    // });
  })
});
