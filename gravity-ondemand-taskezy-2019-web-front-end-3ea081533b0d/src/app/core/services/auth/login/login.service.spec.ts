import { Intercom } from 'ng-intercom';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { of, tap } from 'rxjs';

import { LoginService } from './login.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('LoginService', () => {
  let loginService: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FuseConfirmationService,
        LoginService,
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: MatDialog,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    });
    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: LoginService = TestBed.inject(LoginService);
    expect(service).toBeTruthy();
  });

  it('login fail', () => {
    loginService
      .signIn({
        loginId: 'notarealuser@gmail.com',
        password: '00000000'
      })
      .pipe(
        tap((data) => {
          // if (data) {
          expect(data.status).toEqual(404);
          expect(data.statusText).toEqual('Not Found');
          // }
        })
      )
      .subscribe();
  });

  it('login successful', () => {
    loginService
      .signIn({
        loginId: 'darya@gmail.com',
        password: '11111111'
      })
      .pipe(
        tap((data) => {
          // if (data) {
          expect(data).toEqual({
            id: 11111111,
            loginId: 'darya@gmail.com',
            user: {
              id: 11111111,
              email: 'darya@gmail.com',
              data: {
                mobileVerified: true,
                profileVerified: 2
              },
              firstname: 'darya',
              lastName: '1111',
              mobilePhone: '12341234',
              usernameStatus: 'ACTIVE',
              verified: true,
              active: true
            },
            password: '11111111',
            token: '11111111',
            refreshToken: '11111111',
            statusCode: 200
          });
          // }
        })
      )
      .subscribe();
  });
});
