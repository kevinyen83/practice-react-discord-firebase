import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RosterService } from '../../../../core/services/roster/roster.service';
import { of } from 'rxjs';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { AccountService} from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
import { SelectedIndicatorComponent } from './selected-indicator.component';

describe('SelectedIndicatorComponent', () => {
  let component: SelectedIndicatorComponent;
  let fixture: ComponentFixture<SelectedIndicatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
          BrowserDynamicTestingModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          SharedModule
      ],
      declarations: [ SelectedIndicatorComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
          {
            provide: RosterService,
            useValue: {
              profileService: {
                currentAccount: of({})
              }
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
    fixture = TestBed.createComponent(SelectedIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
