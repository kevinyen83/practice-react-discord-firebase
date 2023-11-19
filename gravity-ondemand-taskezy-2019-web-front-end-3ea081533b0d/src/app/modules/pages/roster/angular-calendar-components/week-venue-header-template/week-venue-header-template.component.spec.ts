import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarEventTitleFormatter, CalendarA11y } from 'angular-calendar';
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

import { WeekVenueHeaderTemplateComponent } from './week-venue-header-template.component';

describe('WeekVenueHeaderTemplateComponent', () => {
  let component: WeekVenueHeaderTemplateComponent;
  let fixture: ComponentFixture<WeekVenueHeaderTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule],
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
            getRoles: () => []
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
      ],
      declarations: [WeekVenueHeaderTemplateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekVenueHeaderTemplateComponent);
    component = fixture.componentInstance;
    const time = moment();
    component.venue = {
      address: {
        street_location: '322 Pitt St, Sydney NSW 2000, Australia',
        geo_location: {
          type: 'Point',
          coordinates: [151.20824, -33.875565]
        }
      },
      uuid: '3333333',
      logo: '',
      name: 'another venue',
      shifts: []
    };
    // component.dayHeaderClicked = ()=> 'done';
    component.days = [];
    component.locale = 'Sydney/Australia';
    component.eventDropped = () => 'done';
    // component.trackByWeekDayHeaderDate = time.format();
    component.dragEnter = () => 'done';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
