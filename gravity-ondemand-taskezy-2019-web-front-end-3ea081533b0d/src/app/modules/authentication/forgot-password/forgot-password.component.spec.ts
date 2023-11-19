import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password.component';
import { FUSE_APP_CONFIG } from '../../../../@fuse/services/config/config.constants';
import { Intercom } from 'ng-intercom';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ForgotPasswordService } from 'app/core/services/auth/forgot-password/forgot-password.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'forgot-password',
            component: ForgotPasswordComponent
          }
        ]),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ForgotPasswordComponent],
      providers: [
        ForgotPasswordService,
        { provide: FUSE_APP_CONFIG, useValue: {} },
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
