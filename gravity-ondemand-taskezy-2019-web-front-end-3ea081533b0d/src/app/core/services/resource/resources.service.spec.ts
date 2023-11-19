import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
  }));

  it('should be created', () => {
    const service: ResourcesService = TestBed.get(ResourcesService);
    expect(service).toBeTruthy();
  });
});
