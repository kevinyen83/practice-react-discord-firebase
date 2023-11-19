import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MobileVerificationService } from './mobile-verification.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('MobileVerificationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    })
  );

  it('should be created', () => {
    const service: MobileVerificationService = TestBed.inject(MobileVerificationService);
    expect(service).toBeTruthy();
  });
});
