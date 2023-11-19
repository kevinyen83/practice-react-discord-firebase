// describe('Details Page', () => {
//   beforeEach(() => {
//     cy.login('darya@gmail.com', '11111111');
//     cy.get('fuse-vertical-navigation-basic-item')
//       .each((el, index) => {
//         if (index === 8) {
//           cy.wrap(el).click();
//         }
//       })
//       .then((res) => {
//         cy.url().should('include', '/pages/interviews');
//       });
//   });

//   it('check Interviews Page', () => {
//     cy.get('[data-cy="logo-text"]').contains('Interviews');
//     cy.get('.mat-tab-label-active').invoke('text').then(txt => {
//       expect(txt.trim()).equal('Interviews');
//     });
//     cy.get('.mat-row').should('have.length', 10);
//     cy.get('#mat-tab-label-0-1').click();
//     cy.get('.mat-tab-label-active').invoke('text').then(txt => {
//       expect(txt.trim()).equal('Templates');
//     });
//     cy.get('.mat-row').should('have.length', 7);
//     cy.get('#mat-tab-label-0-2').click();
//     cy.get('.mat-tab-label-active').invoke('text').then(txt => {
//       expect(txt.trim()).equal('Completed');
//     });
//     cy.get('.mat-row').should('have.length', 6);
//   });
// });
