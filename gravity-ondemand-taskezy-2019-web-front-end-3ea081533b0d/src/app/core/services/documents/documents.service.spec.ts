import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DocumentsService } from './documents.service';
import { environment } from '../../../../environments/environment';

describe('DocumentsService', () => {
  let documentsService: DocumentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentsService]
    });
    documentsService = TestBed.inject(DocumentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: DocumentsService = TestBed.inject(DocumentsService);
    expect(service).toBeTruthy();
  });

  it('put documents successful', () => {
    const documents = [
      {
        type: 'Accreditation',
        accreditation: 'NSW Security',
        description: 'Some description',
        private: true,
        primary: true,
        location: '/usr/whatever'
      }
    ];

    documentsService.updateDocuments(12341234134, documents).subscribe((result) => {
      expect(result).toBe(documents);
      httpMock.expectOne((_req) => _req.method === 'GET' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.expectOne((_req) => _req.method === 'PUT' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.verify();
    });
  });

  it('get documents successful', () => {
    const documents = [
      {
        type: 'Accreditation',
        accreditation: 'NSW Security',
        description: 'Some description',
        private: true,
        primary: true,
        location: '/usr/whatever'
      }
    ];
    documentsService.getDocuments('12341234134').subscribe((result) => {
      expect(result.documents).toBe(documents);

      httpMock.expectOne((_req) => _req.method === 'GET' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.verify();
    });
  });
});
