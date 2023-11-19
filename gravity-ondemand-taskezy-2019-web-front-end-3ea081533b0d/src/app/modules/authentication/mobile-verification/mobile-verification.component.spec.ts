import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MobileVerificationComponent } from './mobile-verification.component';
import { FUSE_APP_CONFIG } from '../../../../@fuse/services/config/config.constants';
import { SharedModule } from 'app/shared/shared.module';
import { Intercom } from 'ng-intercom';
import { LoginService } from 'app/core/services/auth/login/login.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';
import { MobileVerificationService } from 'app/core/services/auth/mobile-verification/mobile-verification.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('VerifyMobileComponent', () => {
  let component: MobileVerificationComponent;
  let fixture: ComponentFixture<MobileVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]), SharedModule],
      declarations: [MobileVerificationComponent],
      providers: [
        { provide: FUSE_APP_CONFIG, useValue: {} },
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: LoginService,
          useValue: {
            tokenData: of({
              mobile: '+61987654321'
            })
          }
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        },
        RefreshService,
        MobileVerificationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileVerificationComponent);
    component = fixture.componentInstance;
    component.last3 = '+61987654321';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
