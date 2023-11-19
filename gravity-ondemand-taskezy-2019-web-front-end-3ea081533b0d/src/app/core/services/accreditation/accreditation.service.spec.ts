import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AccreditationService } from './accreditation.service';

describe('Accreditation Service', () => {
  let service: AccreditationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(AccreditationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
