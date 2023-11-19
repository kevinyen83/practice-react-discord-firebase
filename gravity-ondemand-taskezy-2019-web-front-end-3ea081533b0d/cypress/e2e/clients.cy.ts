describe('Clients page', () => {
  beforeEach(() => {
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 1) {
          cy.wrap(el).click();
        }
      })
      .then(() => {
        cy.url().should('include', '/pages/list-clients');
      });
  });

  it('Check the billing address has the same value when box is ticked', () => {
    // cy.get(':nth-child(3) > :nth-child(2) > .fuse-vertical-navigation-item-wrapper > .mat-tooltip-trigger > .fuse-vertical-navigation-item-title-wrapper > .fuse-vertical-navigation-item-title > span').click()
    cy.get('table > :nth-child(1)').click()
    cy.get('[data-cy="edit-details-button"]').click()
    cy.get('[data-cy="primary-address"]').type('1508 115 Bathurst Street Sydney 2000 NSW')
    cy.get('[data-cy="account-details-header"]').click()
    cy.get('.mat-checkbox-input').should('have.prop', 'checked', false);
    cy.get('.mat-checkbox-inner-container').click()
    cy.get('.mat-checkbox-input').should('have.prop', 'checked', true);
    cy.get('[data-cy="post-address"]').should('not.exist');
    cy.get('.mat-checkbox-inner-container').click()
    cy.get('.mat-checkbox-input').should('have.prop', 'checked', false);
    cy.get('[data-cy="primary-address"]').clear()
    cy.get('[data-cy="primary-address"]').type('not the same address')
    cy.get('[data-cy="post-address-input"]').should('have.value', '1508 115 Bathurst Street Sydney 2000 NSW');
    cy.get('[data-cy="primary-address-input"]').should('have.value', 'not the same address');
    cy.get('.mat-checkbox-inner-container').click()
    cy.get('[data-cy="post-address"]').should('not.exist');
  });

  it('check clients list', () => {
    cy.get('tr').should('have.length', 2);
  });

  it('check statuses for clients', () => {
    cy.get('tr').each((el, index) => {
      if (index === 0) {
        cy.wrap(el).click();
        cy.get('[data-cy="status-element"]').should('be.visible');
        cy.get('[data-cy="status-element"]').contains('Pending');
      }
    });
  });

  it('check create client - externally managed', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
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
    cy.get('[data-cy="primary-industry"]').first().click();
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
    cy.get('[data-cy="managed-type-selector"]').click();
    cy.contains('[role="option"]', 'Externally Managed').click();
    cy.get('[data-cy="name-administrator"]').type('Administrator');
    cy.get('[data-cy="email-administrator"]').type('admin@gmail.com');
    cy.get('[data-cy="uploaded-file"]').selectFile('cypress/fixtures/example.json', {force: true});
    cy.get('[data-cy="save-details-button"]').click();
    cy.get('fuse-confirmation-dialog').should('be.visible');
    cy.wait(1000);
    cy.get('.mat-flat-button').contains('Ok').click();
    cy.get('[data-cy="client"]').should('have.length', 3);
  });

  it('check create client - internally managed', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
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
    cy.get('[data-cy="primary-industry"]').first().click();
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
    cy.get('[data-cy="managed-type-selector"]').click();
    cy.contains('[role="option"]', 'Internally Managed').click();
    cy.get('[data-cy="save-details-button"]').click();
    cy.get('fuse-confirmation-dialog').should('be.visible');
    cy.wait(1000);
    cy.get('.mat-flat-button').contains('Yes, close').click();
    cy.get('[data-cy="client"]').should('have.length', 3);
  });

  it('check create client- when it is externally managed, cannot create without externally managed account details', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
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
    cy.get('[data-cy="primary-industry"]').first().click();
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
    cy.get('[data-cy="managed-type-selector"]').click();
    cy.contains('[role="option"]', 'Externally Managed').click();
    // cy.get('[data-cy="name-administrator"]').type('Administrator');
    // cy.get('[data-cy="email-administrator"]').type('admin@gmail.com');
    // cy.get('[data-cy="uploaded-file"]').selectFile('cypress/fixtures/example.json', {force: true});
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

  it('check create client | abn exists', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
      });
    cy.get('[data-cy="abn-input"]').type('56464757411');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error').invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Already Connected to a client with this ABN');
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

  it('check create client | abn is invalid', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
      });
    cy.get('[data-cy="abn-input"]').type('1234123413241324');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Invalid ABN');
      });
  });

  it('check create client | abn is me', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
      });
    cy.get('[data-cy="abn-input"]').type('12341234134');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Can not invite your own company as a sub account');
      });
  });

  it('check create client | abn is alredy connected', () => {
    cy.get('[data-cy="create-client-button"]').click();
    cy.get('[data-cy="header-text-client"]')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Add a New Client');
      });
    cy.get('[data-cy="abn-input"]').type('98746563111');
    cy.get('[data-cy="search-button"]').click();
    cy.get('mat-error')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Already Connected to a client with this ABN');
      });
  });

  it('client filter check', () => {
    cy.get('[data-cy="filters-icon"]').click();
    cy.get('[data-cy="management-type-select"]').click();
    cy.contains('[role="option"]', 'Externally Managed').click();
    cy.get('[data-cy="managed-cancel-0"]').click()
    cy.get('[data-cy="management-type-select"]').click();
    cy.contains('[role="option"]', 'Internally Managed').click();
    cy.get('[data-cy="management-type-select"]').click();
    cy.contains('[role="option"]', 'Externally Managed').click();
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 2');
    cy.get('[data-cy="search-by-name"]').type("selvador")
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 1');
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="search-by-name"]').type("just random text")
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 0');
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="search-by-name"]').type("great")
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 1');
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="managed-cancel-0"]').click()
    cy.get('[data-cy="managed-cancel-0"]').click()
    cy.get('[data-cy="management-type-select"]').click();
    cy.contains('[role="option"]', 'Internally Managed').click();
    cy.get('[data-cy="status-select"]').click()
    cy.contains('[role="option"]', 'Active').click();
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 0');
    cy.get('[data-cy="status-cancel-0"]').click()
    cy.get('[data-cy="status-select"]').click()
    cy.contains('[role="option"]', 'Pending').click();
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 2');
    cy.get('[data-cy="search-by-name"]').type("just random text")
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 0');
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="search-by-name"]').type("great")
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 1');
    cy.get('[data-cy="status-cancel-0"]').click()
    cy.get('[data-cy="managed-cancel-0"]').click()
    cy.get('[data-cy="search-by-name"]').clear()
    cy.get('[data-cy="filtered-clients"]').should('contain', 'Filtered Clients: 2');
  });
});
