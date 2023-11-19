// describe('Logs Page', () => {
//   beforeEach(() => {
//     cy.login('darya@gmail.com', '11111111');
//     cy.get('fuse-vertical-navigation-basic-item')
//       .each((el, index) => {
//         if (index === 12) {
//           cy.wrap(el).click();
//         }
//       })
//       .then((res) => {
//         cy.url().should('include', '/pages/audit-log');
//       });
//   });

//   it('check Audit log page', () => {
//     cy.get('[data-cy="logo-text"]').contains('Audit Log');
//   })
// })
