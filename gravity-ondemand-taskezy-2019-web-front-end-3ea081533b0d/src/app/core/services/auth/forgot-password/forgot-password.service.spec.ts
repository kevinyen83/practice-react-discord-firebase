import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ForgotPasswordService } from './forgot-password.service';

describe('ForgotPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: ForgotPasswordService = TestBed.inject(ForgotPasswordService);
    expect(service).toBeTruthy();
  });
});
