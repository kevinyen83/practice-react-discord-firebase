import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatDialog } from '@angular/material/dialog';

import { AuthorityVerificationComponent } from './authority-verification.component';
import { ChooseFilesComponent } from '../sub-accounts/choose-files/choose-files.component';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Intercom } from 'ng-intercom';

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

describe('AuthorityVerificationComponent', () => {
  let component: AuthorityVerificationComponent;
  let fixture: ComponentFixture<AuthorityVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        AuthorityVerificationComponent,
        ChooseFilesComponent
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: Intercom,
          useValue: {}
        },
        { provide: MatDialog, useValue: {} },
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
    fixture = TestBed.createComponent(AuthorityVerificationComponent);
    component = fixture.componentInstance;

    component.invitation = {
      sub_account_detail: {
        name: 'hi',
        tradingname: 'hi',
        phone: '1234',
        primary_address: 'over there',
        abn: '4321'
      },
      email: 'email@email.com',
      uuid: '000000'
    };

    component.profile = {
      fullName: 'terry pratchet',
      id: '1'
    };

    fixture.detectChanges();
  });
  //commented out for now until we can work out how to mock firebase
  //storage with changing the bucket dynamicalls properly.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
