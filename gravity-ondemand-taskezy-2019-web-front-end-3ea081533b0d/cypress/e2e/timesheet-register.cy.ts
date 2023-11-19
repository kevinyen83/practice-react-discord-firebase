import * as moment from 'moment';

describe('Timesheet register page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 6) {
          cy.wrap(el).click();
        }
      })
      .then(() => {
        cy.url().should('include', '/pages/timesheet-register');
      });
  });

  it('check Timesheet register header', () => {
    cy.get('[data-cy="timesheet-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Timesheet Register');
      });
  });

  it('check table on Timesheet Register page', () => {
    cy.get('[data-cy="timesheet-table"]').should('be.visible');
    cy.get('[data-cy="timesheet-table"]').should('have.length', 3);
    cy.get('[data-cy="timesheet-table"]').each((item, index) => {
      if (index === 0) {
        cy.wrap(item).find('.mat-cell').each((one, inx) => {
          if (inx === 1) {
            cy.wrap(one).invoke('text').then((txt) => {
              expect(txt.trim()).equal('1');
            });
          }
          if (inx === 2) {
            cy.wrap(one).invoke('text').then((txt) => {
              expect(txt.trim()).equal('0');
            });
          }
          if (inx === 3) {
            cy.wrap(one).invoke('text').then((txt) => {
              expect(txt.trim()).equal('0');
            });
          }
          if (inx === 4) {
            cy.wrap(one).invoke('text').then((txt) => {
              expect(txt.trim()).equal('0');
            });
          }
        }).then(() => {
          cy.wrap(item).click();
        });
      }
    })
    // .then(res => {
    //   cy.get('[data-cy="venue"]').each((venue, i) => {
    //     if (i === 0) {
    //       cy.wrap(venue).find('.td').each((item, idx) => {
    //         if (idx === 1) {
    //           cy.wrap(item).invoke('text').then((txt) => {
    //             expect(txt.trim()).equal('');
    //           })
    //         }
    //         if (idx === 2) {
    //           cy.wrap(item).invoke('text').then((txt) => {
    //             expect(txt.trim()).equal('1');
    //           })
    //         }
    //         if (idx === 3) {
    //           cy.wrap(item).invoke('text').then((txt) => {
    //             expect(txt.trim()).equal('2');
    //           })
    //         }
    //         if (idx === 4) {
    //           cy.wrap(item).invoke('text').then((txt) => {
    //             expect(txt.trim()).equal('0');
    //           })
    //         }
    //       });
    //     }
    //   })
    //   .then(res => {
    //     cy.get('[data-cy="venue"]').each((venue, i) => {
    //       if (i === 1) {
    //         cy.wrap(venue).click({ force: true });
    //       }
    //     });
    //     // cy.get('[data-cy="table-tasks"]').should('be.visible');
    //   });
    // });
  });

  it('check change result for table of tasks(Timesheet register)', () => {
    cy.get('[data-cy="timesheet-table"]').each((item, index) => {
      if (index === 0) {
        cy.wrap(item).click();
        cy.get('[data-cy="venue"]').each((venue, inx) => {
          if (inx === 0) {
            cy.wrap(venue).click();
            cy.get('[data-cy="table-tasks"]').should('exist');
            cy.get('[data-cy="table-tasks"]').each((table, idx) => {
              if (idx === 0) {
                cy.wrap(table).scrollTo('right');
                cy.wrap(table).find('[data-cy="result-menu"]').click();
                cy.get('[data-cy="button-result"]').each((res, i) => {
                  if (i === 1) {
                    cy.wrap(res).click();
                  }
                });
                cy.get('[data-cy="last-edit-field"]').contains(moment().format('DD/MM/YYYY HH:mm'));
              }
            });
          }
        });
      }
    });
  })
});
