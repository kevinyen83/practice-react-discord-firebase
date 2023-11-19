import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
