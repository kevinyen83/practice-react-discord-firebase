import { Intercom, IntercomModule } from 'ng-intercom';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { RefreshService } from './refresh.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('RefreshService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        FuseConfirmationService,
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
    })
  );

  it('should be created', () => {
    const service: RefreshService = TestBed.inject(RefreshService);
    expect(service).toBeTruthy();
  });
});
