import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HomeService } from './home.service';

describe('HomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      HomeService
    ]
  }));

  it('should be created', () => {
    const service: HomeService = TestBed.inject(HomeService);
    expect(service).toBeTruthy();
  });
});
