import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { InterviewsService } from './interviews.service';

describe('InterviewsService', () => {
  let service: InterviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(InterviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
