import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AvatarService } from './avatar.service';

describe('AvatarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: AvatarService = TestBed.inject(AvatarService);
    expect(service).toBeTruthy();
  });
});
