import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { IncidentReportingService } from './incident-reporting.service';

describe('IncidentReportingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: IncidentReportingService = TestBed.inject(IncidentReportingService);
    expect(service).toBeTruthy();
  });
});
