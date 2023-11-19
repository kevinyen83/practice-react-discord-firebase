import { TestBed } from '@angular/core/testing';

import { FormTemplatesService } from './form-templates.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FormTemplatesService', () => {
  let service: FormTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(FormTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
