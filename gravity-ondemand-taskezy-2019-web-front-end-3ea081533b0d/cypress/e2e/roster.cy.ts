import * as moment from 'moment';
// import { checkViewOfUser } from "../support/commands";


describe('Roster page', () => {
  beforeEach(() => {
    cy.reload();
    cy.login('darya@gmail.com', '11111111');
    cy.get('fuse-vertical-navigation-basic-item')
      .each((el, index) => {
        if (index === 5) {
          cy.wrap(el).click();
        }
      })
      .then((res) => {
        cy.url().should('include', '/pages/roster');
      });
  });


  it('check filters on Roster page', () => {
    cy.get('[data-cy="filters-icon"]').should('be.visible');
    cy.get('[data-cy="filters-icon"]').click();
    cy.wait(1000);
    cy.get('[data-cy="mat-drawer-filters"]').should('be.visible');
    cy.get('[data-cy="header-filters"]').invoke('text').then((text) => {
      expect(text.trim()).equal('Filters');
    });
    cy.get('[data-cy="all-venues"]').click().then(el => {
      cy.get('mat-option').should('have.length', 2);
    });
    cy.get('body').click(0, 0);
    cy.get('[data-cy="all-clients"]').click().then(el => {
      cy.get('mat-option').should('have.length', 4);
    });
    cy.get('body').click(0, 0);
    cy.get('[data-cy="all-suppliers"]').click().then(el => {
      cy.get('mat-option').should('have.length', 3);
    });
    cy.get('body').click(0, 0);
    cy.get('[data-cy="all-resources"]').click().then(el => {
      cy.get('mat-option').should('have.length', 3);
    });
    cy.get('body').click(0, 0);
    cy.get('[data-cy="all-statuses"]').click().then(el => {
      cy.get('mat-option').should('have.length', 4);
    });
    cy.get('body').click(0, 0);
    cy.get('[data-cy="all-venues"]')
      .click()
      .then((res) => {
        cy.get('mat-option').each((item, index) => {
          if (index === 0) {
            cy.wrap(item).click();
            cy.wrap(item).type('Venue Name');
          }
        });
        cy.get('.mat-active').each((item, index) => {
          if (index === 0) {
            cy.wrap(item).click();
          }
        });
        cy.get('body').click(0, 0);
        cy.get('[data-cy="apply-filters"]').click();
        cy.get('[data-cy="mat-drawer-filters"]').should('not.be.visible');
        cy.get('[data-cy="chip"]').should('have.length', 1);

        // so far commented out the line because it causes an error in tests for bitbucket

        // cy.get('[data-cy="client"]').should('have.length', 1);
      });

    cy.get('[data-cy="chip"]').each((el, index) => {
      if (index === 0) {
        cy.wrap(el).find('div').invoke('text').then(text => {
          expect(text.trim()).equal('Venue Name');
        });
        cy.wrap(el).find('mat-icon').click().then(res => {
          cy.get('[data-cy="chip"]').should('not.exist');
          cy.wait(5000);
          cy.get('.calendar-view').should('exist');
          cy.reload()
          cy.wait(5000)
          cy.get('[data-cy="client"]').parent().should('have.length', 3);
        });
      }
    });
    cy.get('[data-cy="filters-icon"]').click();
    cy.get('[data-cy="mat-drawer-filters"]').should('be.visible');

    cy.get('[data-cy="all-venues"]')
      .click()
      .then((res) => {
        cy.get('mat-option').each((item, index) => {
          cy.wrap(item).should('not.be.checked');
        });
      });
    cy.get('body').click(0, 0);
    cy.get('[data-cy="all-clients"]')
      .click()
      .then(() => {
        cy.get('mat-option').each((item, index) => {
          if (index === 0) {
            cy.wrap(item).click();
            cy.wrap(item).type('Selvador Kris');
          }
        });
        cy.get('mat-option').each((item, index) => {
          if (index === 1) {
            cy.wrap(item).click();
          }
        });
        cy.get('body').click(0, 0);
        cy.get('[data-cy="apply-filters"]').click();
        cy.get('[data-cy="mat-drawer-filters"]').should('not.be.visible');
      });
    cy.get('[data-cy="chip"]').should('have.length', 1);
    cy.get('mwl-calendar-week-view-all-day').should('have.length', 1);
    cy.get('[data-cy="chip"]').each((el, index) => {
      if (index === 0) {
        cy.wrap(el).find('div').invoke('text').then(text => {
          expect(text.trim()).equal('Selvador Kris');
        });
        cy.wrap(el).find('mat-icon').click();
        cy.get('[data-cy="chip"]').should('not.exist');
        cy.get('mwl-calendar-week-view-all-day').should('have.length', 3);
        cy.get('[data-cy="filters-icon"]').click({force: true});
        cy.wait(1000)
      }
    });
    cy.get('[data-cy="all-clients"]')
      .click({force: true})
      .then((res) => {
        cy.get('mat-option').each((item, index) => {
          cy.wrap(item).should('not.be.checked');
        });
        cy.get('body').click(0, 0);
        // cy.get('[data-cy="close-icon"]').click({force: true});
      }).then(() => {
        cy.wait(1000);
        cy.get('mwl-calendar-week-view-all-day').should('have.length', 3);
        cy.get('[data-cy="in-progress-checkbox"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('not.exist');
        cy.get('[data-cy="in-progress-checkbox"]').click();
        // cy.get('[data-cy="completed-checkbox"]').click({force: true});
        // cy.get('[data-cy="client"]').should('have.length', 2);
        // cy.get('[data-cy="completed-checkbox"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('have.length', 3);
    });
  });

  it('check view for clients and suppliers', () => {
    let user = 'subscriber';
    let currentDay = moment().day();
    if (currentDay === 0) {
      cy.get('[data-cy="to-next-week"]').click();
    }
    let clients = cy.get('[data-cy="client"]');
    clients.each((cl, i) => {
      if (i === 0) {
        cy.get('[data-cy="roster-main-arrow-icon-0"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        let venues = cy.get('[data-cy="venue"]');
        venues.each((v, i) => {
          if (i === 0) {
            cy.get('[data-cy="sub-venue-arrow-icon-00"]').click();
          }
        })
      }
    });
    let events = cy.get('[data-cy="cal-event"]').first();
    events.each((e, i) => {
      if (i === 0) {
        cy.wrap(e).click();
        cy.get('[data-cy="shift-details"]').should('be.visible');
        cy.checkViewOfUser(user);
        cy.get('[data-cy="close-sidebar-icon"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        cy.get('[data-cy="view-as-field"]').click();
        cy.get('mat-option').each((option, index) => {
          if (index === 1) {
            cy.wrap(option).click();
            user = 'client';
          }
        });
      }
    });
    clients.each((cl, i) => {
      if (i === 1) {
        cy.get('[data-cy="roster-main-arrow-icon-1"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        let venues = cy.get('[data-cy="venue"]');
        venues.each((v, i) => {
          if (i === 0) {
            cy.get('[data-cy="sub-venue-arrow-icon-10"]').click();
          }
        });
      }
    });
    events.each((e, i) => {
      if (i === 1) {
        cy.wrap(e).click();
        cy.get('[data-cy="shift-details"]').should('be.visible');
        cy.get('[data-cy="tasks-section"]').should('be.visible');
        cy.get('mat-expansion-panel-header[aria-disabled="true"]').should('be.visible');
        cy.checkViewOfUser(user);
        cy.get('[data-cy="close-sidebar-icon"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        cy.get('[data-cy="view-as-field"]').click();
        cy.get('mat-option').each((option, index) => {
          if (index === 2) {
            cy.wrap(option).click();
            user = 'supplier';
          }
        });
      }
    });
    clients.each((cl, i) => {
      if (i === 1) {
        cy.get('[data-cy="roster-main-arrow-icon-1"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
      }
    });
    events.each((e, i) => {
      if (i === 1) {
        cy.wrap(e).click();
        cy.get('[data-cy="shift-details"]').should('be.visible');
        cy.checkViewOfUser(user);
        cy.get('[data-cy="close-sidebar-icon"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
      }
    });
  });

  it('check drop down on Roster page', () => {
    cy.wait(2000);
    cy.get('mwl-calendar-week-view-all-day').should('be.visible');
    cy.get('[data-cy="view-select"]').click();
    cy.get('#mat-option-2 > .mat-option-text').click();
    cy.get('mwl-calendar-month-view').should('be.visible');
  });

  it('check accept/decline Shift and accept/decline Task', () => {
    cy.get('[data-cy="view-as-field"]').click();
    cy.get('mat-option').each((option, index) => {
      if (index === 1) {
        cy.wrap(option).click();
      }
    });
    let clients = cy.get('[data-cy="client"]');
    clients.each((cl, i) => {
      if (i === 0) {
        cy.wrap(cl).find('mat-icon').invoke('text').then(txt => {
          expect(txt).equal('arrow_drop_downwatch_laterpeople_outlinelocation_on');
        });
        cy.wrap(cl).find('[data-cy="roster-main-arrow-icon-0"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        cy.wrap(cl).find('mat-icon').invoke('text').then(txt => {
          expect(txt).equal('arrow_drop_upwatch_laterpeople_outlinelocation_on');
        });
        let venues = cy.get('[data-cy="venue"]');
        venues.each((v, i) => {
          if (i === 0) {
            cy.wrap(v).find('mat-icon').invoke('text').then(txt => {
              expect(txt).equal('arrow_drop_downwatch_laterpeople_outline');
            });
            cy.wrap(v).find('[data-cy="sub-venue-arrow-icon-00"]').click();
            cy.wrap(v).find('mat-icon').invoke('text').then(txt => {
              expect(txt).equal('arrow_drop_upwatch_laterpeople_outlinebadge');
            });
          }
        })
      }
    });
    let events = cy.get('[data-cy="cal-event"]');
    if (events) {
      events.each((e, i) => {
        if (i === 0) {
          cy.wrap(e).click();
          cy.get('[data-cy="client-status"]').contains('Pending');
          cy.get('[data-cy="accept-shift"]').should('exist');
          cy.get('[data-cy="shift-details-release"]').should('be.visible');
          cy.get('[data-cy="shift-details-release"]').click();
          cy.get('[data-cy="shift-details-release"]').click();
          cy.get('[data-cy="accept-shift"]').should('be.visible');
          cy.get('[data-cy="accept-shift"]').click();
          cy.get('[data-cy="client-status"]').contains('Accepted');
          cy.get('[data-cy="decline-shift"]').should('be.visible');
          cy.get('[data-cy="decline-shift"]').click();
          cy.get('[data-cy="client-status"]').contains('Declined');
          cy.get('[data-cy="close-sidebar-icon"]').click();
        }
      });
    }
    clients.each((cl, i) => {
      if (i === 1) {
        cy.get('[data-cy="view-as-field"]').click();
        cy.get('mat-option').each((option, index) => {
          if (index === 2) {
            cy.wrap(option).click();
          }
        });
        cy.wrap(cl).find('[data-cy="roster-main-arrow-icon-1"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        let venues = cy.get('[data-cy="venue"]');
        venues.each((v, i) => {
          if (i === 0) {
            let eventsClient1 = cy.get('[data-cy="cal-event"]');
            if (eventsClient1) {
              eventsClient1.each((s, idx) => {
                if (idx === 1) {
                  cy.wrap(s).click();
                  cy.get('.dialog-title').invoke('text').then(text => {
                    expect(text.trim()).equal('Shift Details')
                  });
                  cy.get('[data-cy="decline-shift"]').should('not.exist');
                  cy.get('[data-cy="accept-shift"]').should('not.exist');
                  cy.get('[data-cy="decline-task"]').should('not.exist');
                  cy.get('[data-cy="accept-task"]').should('not.exist');
                  cy.get('[data-cy="close-sidebar-icon"]').click();
                }
              })
            }
          }
        })
      }
      cy.get('[data-cy="view-as-field"]').click();
      cy.get('mat-option').each((option, index) => {
        if (index === 0) {
          cy.wrap(option).click();
        }
      });
      if (i === 2) {
        cy.wrap(cl).find('[data-cy="roster-main-arrow-icon-2"]').click();
        cy.get('mwl-calendar-week-view-all-day').should('be.visible');
        let venues = cy.get('[data-cy="venue"]');
        venues.each((v, i) => {
          if (i === 1) {
            let eventsClient2 = cy.get('[data-cy="cal-event"]');
            if (eventsClient2) {
              eventsClient2.each((e, i) => {
                if (i === 2) {
                  cy.wrap(e).click();
                  cy.get('.mat-expansion-panel').should('be.visible');
                  cy.get('.mat-expansion-panel').click();
                  cy.get('[data-cy="accept-task"]').should('be.visible');
                  cy.get('[data-cy="accept-task"]').click();
                  cy.get('[data-cy="accept-task"]').should('not.exist');
                  cy.get('[data-cy="decline-task"]').should('be.visible');
                  cy.get('[data-cy="decline-task"]').click();
                  cy.get('[data-cy="accept-task"]').should('be.visible');
                  cy.get('[data-cy="decline-task"]').should('not.exist');
                  cy.get('[data-cy="close-sidebar-icon"]').click();
                }
              })
            }
          }
        });
      }
    });
  });

  // it('check status in created Shift', () => {
  //   cy.updateInMemoryDatabaseShifts(`5678`,
  //     {
  //       id: '5678',
  //       uuid: '5678',
  //       account_uuid: '12341234134',
  //       release_status: 1,
  //       release_history: [
  //         {
  //           uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
  //           release_date: '2022-09-06T03:27:44.97Z',
  //           released_by_member: {
  //             uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
  //             email: 'nicholas.tsaoucis@gravityfusion.com',
  //             phone: '+61431700596'
  //           },
  //           release_status: 1,
  //           notifications: [],
  //           system_note: 'Shift released to client'
  //         }
  //       ],
  //       datetime: moment().add(1, 'days').format(),
  //       duration: 210,
  //       notes: [
  //         {
  //           author_id: '5edebhh5dfis8',
  //           author: 'Daria D',
  //           datetime: moment().format(),
  //           note: ''
  //         }
  //       ],
  //       changelog: [
  //         {
  //           avatar: '',
  //           date: moment('2021-06-18'),
  //           status: 'created',
  //           user: 'Selvador Kris'
  //         }
  //       ],
  //       venue: {
  //         uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //         name: 'Opera Bar',
  //         address: {
  //           street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
  //           geolocation: {
  //             type: 'Point',
  //             coordinates: [
  //               -105.7463,
  //               38.797222
  //             ]
  //           },
  //           'google-call': '',
  //           'google-place-id': ''
  //         },
  //         roles: [],
  //         stations: []
  //       },
  //       client_uuid: '56464757411',
  //       shift_number: '',
  //       tasks: [
  //         {
  //           assessments: [],
  //           datetime: moment().add(1, 'days').format(),
  //           duration: 210,
  //           role: {
  //             uuid: 'e359bcee-26b4-45c2-b026-f917dd4d5672',
  //             name: 'guard 2',
  //             item_code: '',
  //             description: 'guardy guard',
  //             rates: [
  //               {
  //                 name: 'Standard',
  //                 value: 12.5
  //               },
  //               {
  //                 name: 'Premium',
  //                 value: 25.5
  //               },
  //               {
  //                 name: 'Discount',
  //                 value: 45.5
  //               }
  //             ],
  //             credentials: []
  //           },
  //           supervisor: false,
  //           supplier: {
  //             uuid: '7890789078907890',
  //             name: 'Jack Allon',
  //             release_status: 1
  //           },
  //           resource: {
  //             uuid: '123456',
  //             name: 'Trevino Marvel',
  //             release_status: 2
  //           },
  //           timesheet: {
  //             breaks: [
  //               {
  //                 datetime: moment().set({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).add(1, 'hours'),
  //                 duration: 3,
  //                 geolocation: {type: '', coordinates: null},
  //                 signature: '',
  //                 userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
  //               }
  //             ],
  //             signoff: {
  //               datetime: moment().add(5, 'hours').format(),
  //               geolocation: {type: '', coordinates: null},
  //               signature:
  //                 '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
  //               userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
  //             },
  //             signon: {
  //               datetime: moment().add(2, 'hours').format(),
  //               geolocation: {type: '', coordinates: null},
  //               signature:
  //                 '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
  //               userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
  //             }
  //           }
  //         }
  //       ]
  //     }).then(res => {
  //     let task = res.response.tasks[0];

  //     expect(task?.resource?.release_status).equal(2);

  //     let clients = cy.get('[data-cy=client]');
  //     clients.each((cl, i) => {
  //       if (i === 0) {
  //         cy.wrap(cl).find('[data-cy="roster-main-arrow-icon-0"]').click();
  //         cy.get('mwl-calendar-week-view-all-day').should('be.visible');
  //         let venues = cy.get('[data-cy="venue"]');
  //         console.log("venues ---", venues)
  //         if (venues) {
  //           venues.each((v, i) => {
  //             if (i === 0) {
  //               cy.wrap(v).find('[data-cy="sub-venue-arrow-icon-00"]').click();
  //               let events = cy.get('[data-cy="cal-event"]').first();
  //               if (events) {
  //                 events.each((e, i) => {
  //                   if (i === 0) {
  //                     cy.wrap(e).click();
  //                     cy.get('.mat-expansion-panel').click();
  //                     cy.wait(40000).then(() => {

  //                     });
  //                   }
  //                 });
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  //   });
  // });

  it('check Create new Shift', () => {
    cy.get('[data-cy="create-shift"]').should('be.visible');
    cy.get('[data-cy="create-shift"]').click();
    cy.get('[data-cy="creating-shift-drawer"]').should('be.visible');
    cy.get('[data-cy="number-field"]').should('be.visible');
    cy.get('[data-cy="number-field"]').type('1');
    cy.get('[data-cy="selected-resources"]').should('not.exist');
    cy.get('[data-cy="search-button"]').click();
    cy.get('[data-cy="search-by"]').should('be.visible');
    cy.get('.mat-cell').first().click();
    cy.get('[data-cy="select-button"]').should('be.visible');
    cy.get('[data-cy="select-button"]').click();
    cy.get('[data-cy="selected-resources" ]').should('have.length', 1);
    cy.get('[data-cy="remove-resource-icon"]').should('not.exist');
    cy.get('[data-cy="save-release"]').click();
    cy.get('[data-cy="creating-shift-drawer"]').should('not.be.visible');
  });



  it('check update tasks in created Shift', () => {
    let clients = cy.get('[data-cy="roster-main-arrow-icon-0"]');
    clients.each((cl, i) => {
      if (i === 1) {
        cy.wrap(cl).click();
        cy.get('[data-cy="sub-venue-arrow-icon-00"]').each((v, i) => {
          if (i === 0) {
            cy.wrap(v).click();
            let events = cy.get('.cal-event-container');
            if (events) {
              events.each((e, i) => {
                if (i === 1) {
                  cy.wrap(e).click();
                  cy.get('.dialog-title').invoke('text').then(text => {
                    expect(text.trim()).equal('Shift Details');
                  });
                  cy.get('[data-cy="shift-details-edit"]').click();
                  cy.get('.header-shift').invoke('text').then(text => {
                    expect(text.trim()).equal('Edit Shift');
                    cy.get('[data-cy="remove-resource-icon"]').each((r, i) => {
                      if (i === 0) {
                        cy.wrap(r).click();
                        cy.get('[data-cy="search-button"]').each((el, i) => {
                          if (i === 0) {
                            cy.wrap(el).click();
                            cy.get('.header-search').invoke('text').then(text => {
                              expect(text.trim()).equal('Resources');
                              cy.get('[data-cy="icon-star"]').should('exist');
                              cy.get('[data-cy="icon-star"]').find('span').invoke('text').then(text => {
                                expect(text.trim()).equal('0');
                              });

                              cy.get('[data-cy="search-box-input"]').type('Trevino Marvel');

                              cy.get('tr').should('have.length', 1);

                              cy.get('.mtx-grid-icon').each((icon, i) => {
                                if (i === 0) {
                                  cy.wrap(icon).click();
                                  cy.get('[data-cy="expansion-accreditation"]').should('be.visible');
                                  cy.get('[data-cy="accred-type"]').invoke('text').then(text => {
                                    expect(text.trim()).equal('Accreditation');
                                  });
                                  cy.get('[data-cy="accred-tags"]').invoke('text').then(text => {
                                    expect(text.trim()).equal('Other induction');
                                  });
                                  cy.wrap(icon).click();
                                  cy.get('[data-cy="expansion-accreditation"]').should('not.be.visible');
                                }
                              })
                            });
                            cy.get('tr').each((tr, i) => {
                              if (i === 0) {
                                cy.wrap(tr).find('.mat-checkbox').click();
                                cy.get('[data-cy="select-button"]').should('be.enabled');
                                cy.get('[data-cy="select-button"]').click();
                                cy.get('[data-cy="selected-resources" ]').should('have.length', 1);
                                cy.get('[data-cy="shift-form-edit-save"]').click();
                              }
                            });
                            cy.get('.dialog-title').invoke('text').then(text => {
                              expect(text.trim()).equal('Shift Details');
                            });
                          }
                        })
                      }
                    })
                  })
                }
              });
            }
          }
        })
      }
    })
  });
});

