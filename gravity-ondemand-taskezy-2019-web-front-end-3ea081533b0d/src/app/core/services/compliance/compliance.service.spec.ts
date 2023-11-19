import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ComplianceService } from './compliance.service';
import { environment } from '../../../../environments/environment';

describe('ComplianceService', () => {
  let complianceService: ComplianceService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ComplianceService]
    });
    complianceService = TestBed.inject(ComplianceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ComplianceService = TestBed.inject(ComplianceService);
    expect(service).toBeTruthy();
  });

  it('put accreditation successful', () => {
    const accreditations = [
      {
        uuid: '',
        category: 'Security',
        accreditation: 'Some Accreditation',
        idnumber: '123',
        startdate: '2010-10-10',
        enddate: '2020-11-11',
        primary: true,
        updated: '2020-12-12:10:00:00Z',
        pinged: '2020-12-12:10:00:00Z',
        classes: [
          {
            code: '',
            name: 'Unarmed Guard'
          }
        ],
        documents: [
          {
            type: 'Accreditation',
            accreditation: 'NSW Security',
            description: 'Some description',
            private: true,
            primary: true,
            location: '/usr/whatever'
          }
        ]
      }
    ];

    complianceService.updateAccreditations(12341234134, accreditations).subscribe((result) => {
      expect(result.accreditations).toEqual(accreditations);
      httpMock.expectOne((_req) => _req.method === 'GET' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.expectOne((_req) => _req.method === 'PUT' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.verify();
    });
  });

  it('get accreditation successful', () => {
    const accreditations = [
      {
        uuid: '',
        category: 'Security',
        accreditation: 'Some Accreditation',
        idnumber: '123',
        startdate: '2010-10-10',
        enddate: '2020-11-11',
        primary: true,
        updated: '2020-12-12:10:00:00Z',
        pinged: '2020-12-12:10:00:00Z',
        classes: [
          {
            code: '',
            name: 'Unarmed Guard'
          }
        ],
        documents: [
          {
            type: 'Accreditation',
            accreditation: 'NSW Security',
            description: 'Some description',
            private: true,
            primary: true,
            location: '/usr/whatever'
          }
        ]
      }
    ];
    complianceService.getAccreditations(12341234134).subscribe((result) => {
      expect(result).toEqual(accreditations);
      httpMock.expectOne((_req) => _req.method === 'GET' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.verify();
    });
  });

  it('check licence successful', () => {
    const licenceNumber = '407832933';
    const expectedData = [
      {
        licenceID: '285-Z1C',
        licenceNumber: '407832933',
        status: 'Expired',
        startDate: 'N/A',
        expiryDate: '16/07/2014',
        refusedDate: 'N/A',
        licenceType: 'Master Security Licence',
        licenceName: '',
        licencee: 'A & A Degroot Pty. Limited',
        address: '',
        vehicleRegistration: 'string',
        businessNames: 'string',
        categories: 'string',
        classes: 'string',
        suburb: 'string',
        postcode: 'string'
      }
    ];
    complianceService.verifyComplianceDetails('nsw/security', licenceNumber).subscribe((result) => {
      expect(result).toBeTruthy();
    });

    // const req = httpMock.expectOne(`https://devapi.gravityfusion.com.au/compliance/1.0/security/nsw/${licenceNumber}`, 'call to api');
    // expect(req.request.method).toBe('GET');
    // req.flush(expectedData);
    // httpMock.verify();
  });
});
