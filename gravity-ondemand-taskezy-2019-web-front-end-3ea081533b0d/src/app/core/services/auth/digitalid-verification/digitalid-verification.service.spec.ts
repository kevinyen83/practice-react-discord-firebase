import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DigitalIDVerificationService } from './digitalid-verification.service';

describe('DigitalIDVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: DigitalIDVerificationService = TestBed.inject(DigitalIDVerificationService);
    expect(service).toBeTruthy();
  });
});
