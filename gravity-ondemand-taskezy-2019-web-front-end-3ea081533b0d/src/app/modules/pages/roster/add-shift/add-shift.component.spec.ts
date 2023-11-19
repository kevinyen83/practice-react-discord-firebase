import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AddShiftComponent } from './add-shift.component';
import { ShiftFormComponent } from '../shift-form/shift-form.component';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { of } from 'rxjs';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService } from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
import { RosterService } from '../../../../core/services/roster/roster.service';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MatMomentDatetimeModule } from '@ng-matero/extensions-moment-adapter';

describe('AddShiftComponent', () => {
  let component: AddShiftComponent;
  let fixture: ComponentFixture<AddShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule,
        MtxDatetimepickerModule,
        MatMomentDatetimeModule
      ],
      providers: [
        {
          provide: RosterService,
          useValue: {
            profileService: {
              currentAccount: of({})
            },
            _clickedClient: of({}),
            _clickedDay: of({}),
            getBGColour: () => '#111111'
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
              uuid: '11',
              venues: [
                {
                  roles: []
                }
              ]
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
      declarations: [
        AddShiftComponent,
        ShiftFormComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftComponent);
    component = fixture.componentInstance;
    component.addShiftData = {};
    component.status = 'add';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
