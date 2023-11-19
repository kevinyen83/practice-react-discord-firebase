import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EmailVerificationComponent } from './email-verification.component';
import { FUSE_APP_CONFIG } from '../../../../@fuse/services/config/config.constants';
import { SharedModule } from 'app/shared/shared.module';
import { Intercom } from 'ng-intercom';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';
import { LoginService } from 'app/core/services/auth/login/login.service';
import { FuseAlertModule } from '@fuse/components/alert';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('VerifyEmailComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'verify-email',
            component: EmailVerificationComponent
          },
          {
            path: 'verify-email/:token',
            component: EmailVerificationComponent
          }
        ]),
        SharedModule
      ],
      declarations: [EmailVerificationComponent],
      providers: [
        RefreshService,
        LoginService,
        { provide: FUSE_APP_CONFIG, useValue: {} },
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
