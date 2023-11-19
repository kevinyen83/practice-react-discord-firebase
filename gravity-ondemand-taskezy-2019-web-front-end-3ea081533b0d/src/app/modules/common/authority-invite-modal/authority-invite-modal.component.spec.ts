import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthorityInviteModalComponent } from './authority-invite-modal.component';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { AuthorityVerificationComponent } from '../authority-verification/authority-verification.component';
import { Intercom } from 'ng-intercom';
import { CommonViewModule } from '../common-view.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

let AngularFireMocks = {
  storage: {
    app: {
      storage: jasmine.createSpy('storage')
    }
  },
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.storage.app.storage.and.returnValue(of({ doc: '123ABC' }));
AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('AuthorityInviteModalComponent', () => {
  let component: AuthorityInviteModalComponent;
  let fixture: ComponentFixture<AuthorityInviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorityInviteModalComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        CommonViewModule
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: Intercom,
          useValue: {}
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        },
        {
          provide: AngularFireStorage,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityInviteModalComponent);
    component = fixture.componentInstance;
    component.profile = {};
    component.status = 'external-manager';
    component.invitation = {
      uuid: '81bb7c00-306a-4b9e-ae0d-38c1aa653c68',
      sender: {
        user_id: '976c2ca7-3020-44ee-b26d-dc3d5f1ec9aa',
        email: 'ft+57@mail.com',
        mobile: '+61 412 575 757',
        department: '',
        role: 3,
        role_name: 'Administrator',
        status: 0,
        status_date: '0001-01-01T00:00:00Z',
        address: '57 P. Láng Hạ, Chợ Dừa, Ba Đình, Hà Nội, Vietnam',
        name: 'Fred 57 Test'
      },
      email: 'nicholas.tsaoucis@gravityfusion.com',
      sms: '',
      status: 0,
      date_invited: '2022-10-11T05:09:33.465Z',
      date_resolved: '0001-01-01T00:00:00Z',
      primary_account_id: 'f44988ea-ed25-40c0-b224-fdb907416064',
      primary_account_detail: {
        industry: '',
        abn: '42838498401',
        name: 'MAMBRIDGE PTY LTD & PARKGAP PTY LTD',
        entitytype: 'Other Partnership',
        phone: '+61412575757',
        primary_address: '575 Lexington Ave, New York, NY 10022, USA',
        postal_address: '57 P. Láng Hạ, Chợ Dừa, Ba Đình, Hà Nội, Vietnam',
        logo: ''
      },
      sub_account_id: 'ccf42925-e405-4f0d-8d4f-22ebb16011d5',
      sub_account_detail: {
        industry: '',
        abn: '66161246751',
        name: 'JB HI-FI EDUCATION SOLUTIONS PTY LTD',
        entitytype: 'Australian Private Company',
        phone: '+61412987654',
        primary_address: '1 Ocenas Ave, Pittsburgh, PA 15212, USA',
        postal_address: '1 Ocenas Ave, Pittsburgh, PA 15212, USA',
        logo: ''
      },
      sub_account_type: 'Client',
      invite_name: 'nick',
      invitee_id: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
