import { SharedModule } from 'app/shared/shared.module';
import { Intercom } from 'ng-intercom';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { FUSE_APP_CONFIG } from '../../../../@fuse/services/config/config.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from 'app/core/services/auth/login/login.service';
import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: LoginComponent
          }
        ]),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [LoginComponent],
      providers: [
        LoginService,
        RefreshService,
        {
          provide: Intercom,
          useValue: {}
        },
        { provide: FUSE_APP_CONFIG, useValue: {} },

        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function updateForm(userEmail, userPassword, remember) {
    component.signInForm.controls['email'].setValue(userEmail);
    component.signInForm.controls['password'].setValue(userPassword);
    component.signInForm.controls['rememberMe'].setValue(remember);
  }
  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });
  it('component initial state', () => {
    expect(component.signInForm).toBeDefined();
    expect(component.signInForm.invalid).toBeTruthy();
    expect(component.showAlert).toBeFalsy();
    expect(component.alert).toEqual({
      type: 'success',
      message: ''
    });
  });
  it('form value should update from when u change the input', () => {
    updateForm('darya@gmail.com', '11111111', false);
    expect(component.signInForm.value).toEqual({
      email: 'darya@gmail.com',
      password: '11111111',
      rememberMe: false
    });
  });

  it('form value should update from when u change the input', () => {
    updateForm('darya@gmail.com', '11111111', true);
    expect(component.signInForm.value).toEqual({
      email: 'darya@gmail.com',
      password: '11111111',
      rememberMe: true
    });
  });
  it('Form invalid should be true when form is invalid', () => {
    updateForm('', '', false);
    expect(component.signInForm.invalid).toBeTruthy();
  });
});
