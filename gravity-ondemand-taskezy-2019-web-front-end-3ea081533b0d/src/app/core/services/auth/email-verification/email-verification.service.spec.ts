import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmailVerificationService } from './email-verification.service';

describe('EmailVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: EmailVerificationService = TestBed.inject(EmailVerificationService);
    expect(service).toBeTruthy();
  });
});
