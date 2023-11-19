import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { CellTemplateComponent } from './cell-template.component';
import { SharedModule } from 'app/shared/shared.module';
import { RosterService } from '../../../../../core/services/roster/roster.service';
import { of } from 'rxjs';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService} from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';

describe('CellTemplateComponent', () => {
  let component: CellTemplateComponent;
  let fixture: ComponentFixture<CellTemplateComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [
        {
          provide: RosterService,
          useValue: {
            profileService: {
              currentAccount: of({})
            },
            _clickedClient: of({}),
            _clickedDay: of({})
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
      ],
      declarations: [ CellTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellTemplateComponent);
    component = fixture.componentInstance;
    component.day = {
      events: []
    }
    component.locale = 'Sydney/Australia'
    component.tooltipDelay;
    component.tooltipPlacement;
    component.tooltipTemplate;
    component.tooltipAppendToBody;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
