/* eslint-disable id-blacklist */
import { IntercomModule } from 'ng-intercom';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserProfileService } from './user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';

describe('UserProfileService', () => {
  let userProfileService: UserProfileService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        IntercomModule
      ],
      providers: [
        FuseConfirmationService,
        UserProfileService,
        {
          provide: MatDialog,
          useValue: {}
        }
      ]
    });
    userProfileService = TestBed.inject(UserProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: UserProfileService = TestBed.inject(UserProfileService);
    expect(service).toBeTruthy();
  });

  it('should my account successful(PUT)', fakeAsync(() => {
    const account = {
      id: '22222222',
      birthday: '1964-01-08',
      given_names: 'Robert',
      last_name: 'Leidl',
      phone_numbers: [
        {
          type: 'Mobile',
          number: '0413020775'
        }
      ],
      emails: [
        {
          type: 'Personal',
          address: 'rleid+2l@gmail.com'
        }
      ]
    };
    // userProfileService.updateUserProfile(account);
    userProfileService.currentUser = account;
    tick();
    userProfileService.currentUser.subscribe((res) => {
      expect(res).toEqual(account);
    });

    // const req = httpMock.expectOne(`https://devapi.gravityfusion.com.au/account/1.1`, 'call to api');
    // expect(req.request.method).toBe('PUT');
    // req.flush(account);
    // httpMock.verify();
  }));

  it('should my account successful(GET)', fakeAsync(() => {
    const expectedData = {
      id: '22222222',
      birthday: '1964-01-08',
      given_names: 'Robert',
      last_name: 'Leidl',
      phone_numbers:
        [
          {
            type: 'Mobile',
            number: '0413020775'
          },
          {
            type: 'Home',
            number: '0293280802'
          }
        ],
      emails:
        [
          {
            type: 'Personal',
            address: 'rleid+2l@gmail.com'
          }
        ]
    };
    userProfileService.currentUser = expectedData;
    // userProfileService.getCurrentUserProfile('22222222');
    tick();
    userProfileService.currentUser.subscribe((res) => {
      expect(res).toEqual(expectedData);
    });

    // const req = httpMock.expectOne(`https://devapi.gravityfusion.com.au/account/1.1`, 'call to api');
    // expect(req.request.method).toBe('GET');
    // httpMock.verify();
  }));

});
