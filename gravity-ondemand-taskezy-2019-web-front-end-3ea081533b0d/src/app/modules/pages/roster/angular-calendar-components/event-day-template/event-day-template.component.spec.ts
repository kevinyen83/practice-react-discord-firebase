import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, CalendarA11y, CalendarEventTitleFormatter } from 'angular-calendar';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { SharedModule } from 'app/shared/shared.module';
import moment from 'moment';
import { of } from 'rxjs';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService} from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
import { RosterService } from '../../../../../core/services/roster/roster.service';

import { EventDayTemplateComponent } from './event-day-template.component';

describe('EventDayTemplateComponent', () => {
  let component: EventDayTemplateComponent;
  let fixture: ComponentFixture<EventDayTemplateComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,    BrowserAnimationsModule,
        CalendarModule
      ],
      declarations: [ EventDayTemplateComponent ],
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
              getAllVenuesForAllClients: (uuid) => of([])
            }
          },
          {
            provide: ClientsService,
            useValue: {
              clients: of([]),
              getClients: (uuid) => []
            }
          },
          {
            provide: ResourcesService,
            useValue: {
              resources: of([]),
              getResources: (uuid) => [],
              getRoles: () => [],
            }
          },
          {
            provide: SuppliersService,
            useValue: {
              suppliers: of([]),
              getSuppliers: (uuid) => []
            }
          },
          {
            provide: AccountService,
            useValue: {
              currentAccount: of({
                uuid: '11'
              }),
              getProfileSingle: (uuid) => {},
              getResourcesAndSuppliers: (uuid) => of([]),
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDayTemplateComponent);
    component = fixture.componentInstance;
    const time = moment();
    component.itemMeta = {
      item: {
        id: '1',
        title: 'an event',
        color: 'red',
        backgroundColor: 'black',
        start: time.format(),
        end: time.add(6,'h').format(),
        tooltip: 'tooltip',
        address:'',
        client: {
          profile_name: 'a name'
        },
        supplier: {
          profile_name: 'b name'
        },
        resource: {
          profile_name: 'c name'
        }
      }
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
