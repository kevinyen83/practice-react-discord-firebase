import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { SharedModule } from 'app/shared/shared.module';
import { of } from 'rxjs';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService} from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
import { RosterService } from '../../../../core/services/roster/roster.service';

import { TaskChecklistComponent } from './task-checklist.component';

describe('TaskChecklistComponent', () => {
  let component: TaskChecklistComponent;
  let fixture: ComponentFixture<TaskChecklistComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        SharedModule,    BrowserAnimationsModule
      ],
      declarations: [ TaskChecklistComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: RosterService,
          useValue: {
            profileService: {
              currentAccount: of({})
            },
            _clickedClient: of({})
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
    fixture = TestBed.createComponent(TaskChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
