import { SharedModule } from 'app/shared/shared.module';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShiftFormComponent } from './shift-form.component';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { ClientsService } from 'app/core/services/client/clients.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService } from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
import { RosterService } from '../../../../core/services/roster/roster.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MatMomentDatetimeModule } from '@ng-matero/extensions-moment-adapter';
import { By } from "@angular/platform-browser";
import {FormControl} from "@angular/forms";
import {InvitationsFakeDb} from "../../../../fake-db/invitations";
import {ClientsFakeDb} from "../../../../fake-db/clients";
import {MembersFakeDb} from "../../../../fake-db/members";
import {SuppliersFakeDb} from "../../../../fake-db/suppliers";
import {ResourcesFakeDb} from "../../../../fake-db/resources";
import {VenuesFakeDb} from "../../../../fake-db/venues";
import {SearchByUsersComponent} from "../search-by-users/search-by-users.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

describe('ShiftFormComponent', () => {
  let component: ShiftFormComponent;
  let fixture: ComponentFixture<ShiftFormComponent>;
  let fixture1: ComponentFixture<SearchByUsersComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        MtxDatetimepickerModule,
        MatMomentDatetimeModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
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
            currentAccount: of( {
              id: 12341234134,
              uuid: '12341234134',
              detail: {
                avatar: 'https://picsum.photos/100?random=2',
                individual: false,
                primaryindustry: 'Security',
                abn: '12341234134',
                acn: '2378273982798789',
                name: "Robert's Super Security Firm Pty Ltd",
                tradingname: 'Super Security',
                entitytype: 'Sole Trader',
                phone_numbers: [],
                emails: [
                  {
                    type: 'personal',
                    number: 'darya@gmail.com'
                  }
                ]
              },
              payment_instruments: [
                { valid: true }
              ],
              accountsCount: 0,
              primaryadmin: '',
              documents: [],
              accreditation: [],
              admins: [],
              externalInvites: {
                client_invitations: [],
                supplier_invitations: []
              },
              invitations: InvitationsFakeDb.invitations,
              clients: ClientsFakeDb.clients,
              members: MembersFakeDb.members,
              suppliers: SuppliersFakeDb.suppliers,
              resources: ResourcesFakeDb.resources,
              venues: VenuesFakeDb.venues
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
      declarations: [ShiftFormComponent, SearchByUsersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftFormComponent);
    fixture1 = TestBed.createComponent(SearchByUsersComponent);
    component = fixture.componentInstance;
    component.data = {};
    component.createAddShiftForm();
    component.addResourcesField();
    component.viewAs = new FormControl('subscriber');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check Add Shift Form', () => {
    let venues = component.currentAccount.venues;
    let selectedVenue = venues[0];
    component.addShiftForm.get('venue').setValue(venues[0]);
    component.resourcesRequirementsControls.controls[0].get('shiftRole').setValue(selectedVenue.roles[0]);
    component.resourcesRequirementsControls.controls[0].get('shiftNumber').setValue(1);
    spyOn(component, 'search');

    let buttonSearch = fixture.debugElement.nativeElement.querySelector('.search-button');
    expect(buttonSearch.disabled).toBeFalsy();
    buttonSearch.click();
    fixture.detectChanges();
    let headerSearch = fixture1.debugElement.nativeElement.querySelector('.header-search');
    expect(headerSearch.innerText).toBe('Select Resources');

  });
});
