import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ResetPasswordService } from './reset-password.service';

describe('ResetPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: ResetPasswordService = TestBed.inject(ResetPasswordService);
    expect(service).toBeTruthy();
  });
});
