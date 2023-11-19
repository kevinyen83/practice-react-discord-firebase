import { TestBed } from '@angular/core/testing';

import { VenuesService } from './venues.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('VenuesService', () => {
  let service: VenuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    });
    service = TestBed.inject(VenuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
