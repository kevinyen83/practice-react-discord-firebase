import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SuppliersService } from './suppliers.service';

describe('SuppliersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: SuppliersService = TestBed.inject(SuppliersService);
    expect(service).toBeTruthy();
  });
});
