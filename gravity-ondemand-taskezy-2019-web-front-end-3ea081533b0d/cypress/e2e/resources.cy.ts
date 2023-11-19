describe('Resources Page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 4) {
          cy.wrap(el).click();
        }
      })
      .then(() => {
        cy.url().should('include', '/pages/list-resources');
      });
  });

  it('check Resources active', () => {
    cy.get('[data-cy="logo-text"]').contains('Resources');
    cy.get('tr').should('have.length', 8);
    cy.get('tr')
      .each((item, index) => {
        if (index === 1) {
          cy.wrap(item).click();
        }
      })
      .then(() => {
        cy.get('[data-cy="button-menu-Resource details"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).equal('Resource details');
          });
        cy.get('[data-cy="name-element"]').contains('Trevino Marvel');
        cy.get('[data-cy="status-element"]').contains('Active');
        cy.get('[data-cy="deactivate-resource-button"]').should('be.visible');
      });
    // cy.get('[data-cy="button-menu-Reports"]')
    //   .click()
    //   .then(() => {
    //     cy.get('[data-cy="button-menu-Reports"] > .mat-button-wrapper')
    //       .invoke('text')
    //       .then((txt) => {
    //         expect(txt.trim()).equal('Reports');
    //       });
    //   });
    // cy.get('[data-cy="button-menu-Roster Details"]')
    //   .click()
    //   .then(() => {
    //     cy.get('[data-cy="button-menu-Roster Details"] > .mat-button-wrapper')
    //       .invoke('text')
    //       .then((txt) => {
    //         expect(txt.trim()).equal('Roster Details');
    //       });
    //   });
    cy.get('[data-cy="button-menu-Documents"]')
      .click()
      .then(() => {
        cy.get('[data-cy="button-menu-Documents"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).contains('Documents');
          });
      });
    cy.get('[data-cy="button-menu-Assessments"]')
      .click()
      .then(() => {
        cy.get('[data-cy="button-menu-Assessments"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).equal('Assessments');
          });
      });
    cy.get('[data-cy="button-menu-Accreditations"]')
      .click()
      .then(() => {
        cy.get('[data-cy="button-menu-Accreditations"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).equal('Accreditations');
          });
        cy.get('[data-cy="add-accreditation-button"]').click();
        cy.get('[data-cy="header-drawer"]').should('be.visible');
        cy.get('[data-cy="header-drawer"]').invoke('text').then(text => {
          expect(text.trim()).equal('Add accreditations');
        })
        cy.get('[data-cy="category-field"]').click();
        cy.get('[data-cy="select-dropdown"]').each((option, idx) => {
          if (idx === 0) {
            cy.wrap(option).click();
          }
        })
        cy.get('[data-cy="select-accreditation"]').should('be.visible');
        cy.get('[data-cy="select-accreditation"]').click();
        cy.get('[data-cy="select-option"]').each((opt, i) => {
          if (i === 0) {
            cy.wrap(opt).click();
          }
        })
        cy.get('[data-cy="licence-number"]').should('be.visible');
        cy.get('[data-cy="licence-number"]').type('411599644');
        cy.get('[data-cy="verify-button"]').click();
        cy.get('[data-cy="choose-file-button"]').eq(0).click();
        cy.get('[data-cy="upload-file"]').eq(0).selectFile({
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'file.txt',
          lastModified: Date.now(),
        }, {force: true});
        cy.get('[data-cy="choose-file-button"]').eq(1).click();
        cy.get('[data-cy="upload-file"]').eq(1).selectFile({
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'file.txt',
          lastModified: Date.now(),
        }, {force: true});
        cy.get('[data-cy="uploaded-files"]').eq(0).should('exist');
        cy.get('[data-cy="uploaded-files"]').eq(1).should('exist');
        cy.get('[data-cy="save-button"]').should('be.enabled');
        cy.get('[data-cy="save-button"]').click();
        cy.get('[data-cy="mat-card"]').should('be.visible');
        cy.get('[data-cy="mat-card"]').find('img').should('be.visible');
        cy.get('[data-cy="mat-card"]').find('img').eq(0).click();
        cy.get('[data-cy="preview-img"]').should('be.visible');
        cy.get('body').click(0, 0);
        cy.get('[data-cy="mat-card"]').find('img').eq(1).click();
        cy.get('[data-cy="preview-img"]').should('be.visible');
        cy.get('body').click(0, 0);
        cy.get('[data-cy="mat-card"]').find('[data-cy="delete-icon"]').click();
        cy.get('[data-cy="mat-card"]').should('not.exist');
      });
    // cy.get('[data-cy="button-menu-Charge Rates and Statistics"]')
    //   .click()
    //   .then(() => {
    //     cy.get('[data-cy="button-menu-Charge Rates and Statistics"] > .mat-button-wrapper')
    //       .invoke('text')
    //       .then((txt) => {
    //         expect(txt.trim()).equal('Charge Rates and Statistics');
    //       });
    //   });
    cy.get('[data-cy="back-line"]').should('be.visible');
    cy.get('[data-cy="back-line"]').click();
    cy.url().should('include', '/pages/list-resources');
  });

  it('check Resources inactive page', () => {
    cy.get('[data-cy="logo-text"]').contains('Resources');
    cy.get('tr').should('have.length', 8);
    cy.get('tr')
      .each((item, index) => {
        if (index === 2) {
          cy.wrap(item).click();
        }
      })
      .then(() => {
        cy.get('[data-cy="button-menu-Resource details"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).equal('Resource details');
          });
        cy.get('[data-cy="name-element"]').contains('Trevino Marvel');
        cy.get('[data-cy="status-element"]').contains('Inactive');
        cy.get('[data-cy="activate-resource-button"]').should('be.visible');
      });
    // cy.get('[data-cy="button-menu-Reports"]')
    //   .click()
    //   .then(() => {
    //     cy.get('[data-cy="button-menu-Reports"] > .mat-button-wrapper')
    //       .invoke('text')
    //       .then((txt) => {
    //         expect(txt.trim()).equal('Reports');
    //       });
    //   });
    // cy.get('[data-cy="button-menu-Roster Details"]')
    //   .click()
    //   .then(() => {
    //     cy.get('[data-cy="button-menu-Roster Details"] > .mat-button-wrapper')
    //       .invoke('text')
    //       .then((txt) => {
    //         expect(txt.trim()).equal('Roster Details');
    //       });
    //   });
    cy.get('[data-cy="button-menu-Documents"]')
      .click()
      .then(() => {
        cy.get('[data-cy="button-menu-Documents"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).contains('Documents');
          });
      });
    cy.get('[data-cy="button-menu-Assessments"]')
      .click()
      .then(() => {
        cy.get('[data-cy="button-menu-Assessments"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).equal('Assessments');
          });
      });
    cy.get('[data-cy="button-menu-Accreditations"]')
      .click()
      .then(() => {
        cy.get('[data-cy="button-menu-Accreditations"] > .mat-button-wrapper')
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).equal('Accreditations');
          });

      });
    // cy.get('[data-cy="button-menu-Charge Rates and Statistics"]')
    //   .click()
    //   .then(() => {
    //     cy.get('[data-cy="button-menu-Charge Rates and Statistics"] > .mat-button-wrapper')
    //       .invoke('text')
    //       .then((txt) => {
    //         expect(txt.trim()).equal('Charge Rates and Statistics');
    //       });
    //   });
    cy.get('[data-cy="back-line"]').should('be.visible');
    cy.get('[data-cy="back-line"]').click();
    cy.url().should('include', '/pages/list-resources');
  });
});
