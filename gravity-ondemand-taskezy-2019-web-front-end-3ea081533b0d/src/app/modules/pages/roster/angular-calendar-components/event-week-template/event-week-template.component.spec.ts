import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarModule, CalendarMonthModule, CalendarDayModule, CalendarWeekModule, CalendarEventTitleFormatter, CalendarA11y } from 'angular-calendar';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { SharedModule } from 'app/shared/shared.module';
import moment from 'moment';
import { of } from 'rxjs';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService } from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
import { RosterService } from '../../../../../core/services/roster/roster.service';

import { EventWeekTemplateComponent } from './event-week-template.component';

describe('EventWeekTemplateComponent', () => {
  let component: EventWeekTemplateComponent;
  let fixture: ComponentFixture<EventWeekTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([]), SharedModule, CalendarModule],
      declarations: [EventWeekTemplateComponent],
      providers: [
        CalendarEventTitleFormatter,
        CalendarA11y,
        // {
        //   provide:CalendarA11y,
        //   useValue: {}
        // },
        {
          provide: RosterService,
          useValue: {
            profileService: {
              currentAccount: of({})
            },
            _clickedClient: of({}),
            _clickedDay: of({}),
            clickedId: of('anId')
          }
        },
        {
          provide: VenuesService,
          useValue: {
            venues: of([]),
            getVenues: () => [],
            getAllVenuesForAllClients: uuid => of([])
          }
        },
        {
          provide: ClientsService,
          useValue: {
            clients: of([]),
            getClients: uuid => []
          }
        },
        {
          provide: ResourcesService,
          useValue: {
            resources: of([]),
            getResources: uuid => [],
            getRoles: () => []
          }
        },
        {
          provide: SuppliersService,
          useValue: {
            suppliers: of([]),
            getSuppliers: uuid => []
          }
        },
        {
          provide: AccountService,
          useValue: {
            currentAccount: of({
              uuid: '11'
            }),
            getProfileSingle: uuid => {},
            getResourcesAndSuppliers: uuid => of([]),
            setPauseRefresh: (bool) => {}
          }
        },
        {
          provide: AvatarService,
          useValue: {}
        },
        {
          provide: ComplianceService,
          useValue: {
            checkAccreditation: () => []
          }
        },
        {
          provide: UserProfileService,
          useValue: {
            currentUser: of({})
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWeekTemplateComponent);
    component = fixture.componentInstance;
    const time = moment();
    component.weekEvent = {
      event: {
        id: '1',
        isAllDay: true,
        allDay: true,
        color: 'red',
        display: 'auto',
        leftBorderColor: 'black',
        draggable: false,
        start: time,
        end: time.add(5, 'h'),
        venue: {
          address: {
            street_location: '322 Pitt St, Sydney NSW 2000, Australia',
            geo_location: {
              type: 'Point',
              coordinates: [151.20824, -33.875565]
            }
          },
          uuid: '3333333',
          logo: '',
          name: 'another venue'
        },
        rawShift: {
          uuid: '111111',
          account_uuid: '111111',
          admin: [],
          client_uuid: '2222222',
          datetime: time.format(),
          duration: 300,
          notes: [],
          release_history: [
            {
              uuid: '11111-11111',
              release_date: time.format(),
              released_by_member: {
                uuid: '111111111',
                email: 'email@email.com',
                phone: '12341234'
              },
              release_status: 1,
              notifications: [],
              system_note: 'Shift released to client'
            },
            {
              uuid: '11111-22222',
              release_date: time.format(),
              released_by_member: {
                uuid: '111111111',
                email: 'email@email.com',
                phone: '12341234'
              },
              release_status: 2,
              notifications: [],
              system_note: 'Shift released to supplier'
            }
          ],
          release_status: 2,
          shift_number: '',
          supplier_status: 2,
          tasks: [
            {
              uuid: '44444444',
              assessements: [],
              datetime: time.format(),
              duration: 300,
              notes: [],
              resouce: {
                email: 'resource@email.com',
                name: 'the resource',
                uuid: '777777777'
              },
              role: {
                credentials: [],
                description: 'guardy guard',
                item_code: '',
                name: 'guard 2',
                rates: [
                  { name: 'Standard', value: 5 },
                  { name: 'Premium', value: 10 },
                  { name: 'Discount', value: 2.5 }
                ],
                uuid: 'e359bcee-26b4-45c2-b026-f917dd4d5672'
              },
              shift_uuid: '111111',
              supervisor: false,
              supplier: {
                email: '',
                name: 'the supplier',
                uuid: '66666666'
              },
              task_items: [],
              timesheet: {
                break: null,
                signon: null,
                signoff: null,
                uuid: '55555555'
              }
            }
          ],
          venue: {
            address: {
              street_location: '322 Pitt St, Sydney NSW 2000, Australia',
              geo_location: {
                type: 'Point',
                coordinates: [151.20824, -33.875565]
              }
            },
            uuid: '3333333',
            logo: '',
            name: 'another venue'
          }
        },
        release_status: 2,
        selected: false
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
