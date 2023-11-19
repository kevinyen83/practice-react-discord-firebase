describe('Suppliers page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 3) {
          cy.wrap(el).click();
        }
      })
      .then(() => {
        cy.url().should('include', '/pages/list-suppliers');
      });
  });

  it('check suppliers list', () => {
    cy.get('tr').should('have.length', 2);
  });

  it('check statuses for suppliers', () => {
    cy.get('tr').each((el, index) => {
      if (index === 0) {
        cy.wrap(el).click();
        cy.get('[data-cy="status-element"]').should('be.visible');
        cy.get('[data-cy="status-element"]').contains('Pending');
      }
    });
  });

  it('check create supplier', () => {
    cy.get('[data-cy="create-supplier-button"]').click();
    cy.get('[data-cy="header-text-supplier"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Supplier');
      });
    cy.get('[data-cy="abn-input"]').type('99999999999');
    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="name-input"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('THE TRUSTEE FOR PSS FUND');
      });
    cy.get('[data-cy="button-confirm"]').click();
    cy.get('[data-cy="account-details-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Account details');
      });
    cy.get('[data-cy="primary-industry"]').click();
    cy.contains('[role="option"]', 'Security').click();
    // cy.get('[data-cy="primary-industry"]').select('Security');
    cy.get('[data-cy="primary-address"]').click();
    cy.get('[data-cy="primary-address"]').clear();
    cy.get('[data-cy="primary-address"]').type('121 Pitt Street, Sydney NSW, Australia');
    cy.get('[data-cy="post-address"]').click();
    cy.get('[data-cy="post-address"]').clear();
    cy.get('[data-cy="post-address"]').type('121 Pitt Street, Sydney NSW, Australia');
    cy.get('[data-cy="website"]').type('google.com');
    cy.get('[data-cy="phone-number"]').type('456776535');
    // cy.get('[data-cy="managed-type-selector"]').click();
    // cy.contains('[role="option"]', 'Externally Managed').click();
    cy.get('[data-cy="name-administrator"]').type('Administrator');
    cy.get('[data-cy="email-administrator"]').type('admin@gmail.com');
    cy.get('[data-cy="uploaded-file"]').selectFile('cypress/fixtures/example.json', {force: true});
    cy.get('[data-cy="save-details-button"]').click();
    cy.get('fuse-confirmation-dialog').should('be.visible');
    cy.wait(1000);
    cy.get('.mat-flat-button').contains('Ok').click();
    cy.get('[data-cy="supplier"]').should('have.length', 3);
  });

  it('check create supplier - cannot create without external manager', () => {
    cy.get('[data-cy="create-supplier-button"]').click();
    cy.get('[data-cy="header-text-supplier"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Supplier');
      });
    cy.get('[data-cy="abn-input"]').type('99999999999');
    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="name-input"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('THE TRUSTEE FOR PSS FUND');
      });
    cy.get('[data-cy="button-confirm"]').click();
    cy.get('[data-cy="account-details-header"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Account details');
      });
    cy.get('[data-cy="primary-industry"]').click();
    cy.contains('[role="option"]', 'Security').click();
    cy.get('[data-cy="primary-address"]').click();
    cy.get('[data-cy="primary-address"]').clear();
    cy.get('[data-cy="primary-address"]').type('121 Pitt Street, Sydney NSW, Australia');
    cy.get('[data-cy="post-address"]').click();
    cy.get('[data-cy="post-address"]').clear();
    cy.get('[data-cy="post-address"]').type('121 Pitt Street, Sydney NSW, Australia');
    cy.get('[data-cy="website"]').type('google.com');
    cy.get('[data-cy="phone-number"]').type('456776535');
    cy.get('[data-cy="uploaded-file"]').selectFile('cypress/fixtures/example.json', {force: true});
    cy.get('[data-cy="save-details-button"]').click();
    cy.get('[data-cy="invite-name-required-error"]')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).equal('This field is required');
    });
    cy.get('[data-cy="invite-email-required-error"]')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).equal('This field is required');
    });
  });

  it('check create supplier | abn exists', () => {
    cy.get('[data-cy="create-supplier-button"]').click();
    cy.get('[data-cy="header-text-supplier"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Supplier');
      });
    cy.get('[data-cy="abn-input"]').type('90909088888');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error').invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Already Connected to a supplier with this ABN');
      });
    // cy.get('[data-cy="name-input"]')
    //   .invoke('text')
    //   .then((text) => {
    //     expect(text.trim()).equal('THE TRUSTEE FOR PSS FUND');
    //   });
    // cy.get('[data-cy="button-confirm"]').click();
    // cy.get('fuse-confirmation-dialog')
    //   .invoke('text')
    //   .then((text) => {
    //     expect(text.trim()).contains('Connection request');
    //   });
  });

  it('check create supplier | abn is invalid', () => {
    cy.get('[data-cy="create-supplier-button"]').click();
    cy.get('[data-cy="header-text-supplier"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Supplier');
      });
    cy.get('[data-cy="abn-input"]').type('1234123413241324');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Invalid ABN');
      });
  });

  it('check create supplier | abn is me', () => {
    cy.get('[data-cy="create-supplier-button"]').click();
    cy.get('[data-cy="header-text-supplier"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Supplier');
      });
    cy.get('[data-cy="abn-input"]').type('12341234134');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Can not invite your own company as a sub account');
      });
  });

  it('check create supplier | abn is alredy connected', () => {
    cy.get('[data-cy="create-supplier-button"]').click();
    cy.get('[data-cy="header-text-supplier"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Supplier');
      });
    cy.get('[data-cy="abn-input"]').type('98746563111');
    cy.get('[data-cy="search-button"]').click();
    cy.get('fuse-confirmation-dialog').should('be.visible');
    cy.get('.mat-flat-button').click();
    cy.get('[data-cy="text-info"]').invoke('text').then(text => {
      expect(text.trim()).equal('Please check the Account Information.If the information is correct continue creating the Supplier.');
    });
  });

  it('check filter for suppliers', () => {
    cy.get('[data-cy="filters-icon"]').click()
    cy.get('[data-cy="status-select"]').click()
    cy.contains('[role="option"]', 'Active').click();
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 0');
    cy.get('[data-cy="status-cancel-0"]').click()
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 2');
    cy.get('[data-cy="search-by-name"]').type("just random text")
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 0');
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="status-select"]').click()
    cy.contains('[role="option"]', 'Pending').click();
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 2');
    cy.get('[data-cy="search-by-name"]').type("jack")
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 1');
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="search-by-name"]').type("ket")
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 1');
    cy.get('[data-cy="status-cancel-0"]').click()
    cy.get('[data-cy="status-select"]').click()
    cy.contains('[role="option"]', 'Active').click();
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 0');
    cy.get('[data-cy="status-cancel-0"]').click()
    cy.get('[data-cy="filtered-suppliers"]').should('contain', 'Filtered Suppliers: 1');
  });
});
