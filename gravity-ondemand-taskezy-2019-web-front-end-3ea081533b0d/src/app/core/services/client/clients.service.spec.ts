import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: ClientsService = TestBed.inject(ClientsService);
    expect(service).toBeTruthy();
  });
});
