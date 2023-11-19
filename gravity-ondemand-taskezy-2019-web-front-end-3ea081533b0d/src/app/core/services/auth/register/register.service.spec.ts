import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RegisterService } from './register.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Intercom } from 'ng-intercom';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('RegisterService', () => {
  let registerService: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        FuseConfirmationService,
        RegisterService,
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    registerService = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    // const service: RegisterService = TestBed.inject(RegisterService);
    // expect(service).toBeTruthy();
  });

  it('should post the data register successful', () => {
    // registerService.registerUser({
    //   id: 25,
    //   name: 'nameValue',
    //   email: 'someuser@gmail.com',
    //   password: '23232323',
    //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    // }).subscribe((result) => {
    //   expect(result.email).toBe('someuser@gmail.com');
    //   expect(result.timezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone);
    // });
  });
});
