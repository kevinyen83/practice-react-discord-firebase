import * as moment from 'moment';

describe('Dashboard page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
  });

  it('check Dashboard header', () => {
    cy.get('[data-cy="dashboard-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Dashboard');
      });
    // cy.get('[data-cy="total-tasks"]').each((item, i) => {
    //   if (i === 0) {
    //     cy.wrap(item)
    //       .invoke('text')
    //       .then((text) => {
    //         expect(parseInt(text.trim())).greaterThan(1);
    //       });
    //   }
    // });
    cy.get('[data-cy="total-tasks-total-tasks"]').invoke('text')
    .then((text) => {
      expect(parseInt(text.trim())).greaterThan(1);
    });
  });
});
