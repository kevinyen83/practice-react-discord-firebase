import { ComplianceService } from '../compliance/compliance.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountService } from 'app/core/services/account/account.service';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';

describe('ProfileService', () => {
  let accountService: AccountService;
  let complianceService: ComplianceService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FuseConfirmationService,
        AccountService,
        {
          provide: MatDialog,
          useValue: {}
        }
      ]
    });
    accountService = TestBed.inject(AccountService);
    complianceService = TestBed.inject(ComplianceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: AccountService = TestBed.inject(AccountService);
    expect(service).toBeTruthy();
  });

  it('put detail successful', () => {
    const uuid = '5137677e-f7ce-47f6-85ab-82b087ab02ca';
    const detail = {
      primaryindustry: 'Security',
      abn: '90909088888',
      acn: '2378273982798789',
      name: 'Robert Leidl',
      tradingname: 'Super Security',
      entitytype: 'Sole Trader',
      phone_numbers: [
        {
          type: 'Mobile',
          value: '0413020772'
        }
      ],
      emails: [
        {
          type: 'General Information',
          value: 'info@super.com'
        }
      ]
    };

    accountService.updateDetail(uuid, detail).subscribe((res) => {
      expect(res).toBe(detail);
      httpMock.expectOne((_req) => _req.method === 'GET' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.expectOne((_req) => _req.method === 'PUT' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.verify();
    });
  });

  it('get detail successful', () => {
    const expectedData = {
      primaryindustry: 'Security',
      abn: '90909088888',
      acn: '2378273982798789',
      name: 'Robert Leidl',
      tradingname: 'Super Security',
      entitytype: 'Sole Trader',
      phone_numbers: [
        {
          type: 'Mobile',
          value: '0413020772'
        }
      ],
      emails: [
        {
          type: 'General Information',
          value: 'info@super.com'
        }
      ]
    };
    accountService.getDetail('5137677e-f7ce-47f6-85ab-82b087ab02ca').subscribe((result) => {
      expect(result.details).toBe(expectedData);
      httpMock.expectOne((_req) => _req.method === 'GET' && _req.url.includes(environment.apiUrlBusinessAccount));
      httpMock.verify();
    });
  });

  it('check abn successful', () => {
    const abn = '74172177893';
    const expectedData = {
      Abn: '74172177893',
      AbnStatus: 'Active',
      AddressDate: '2011-06-23',
      AddressPostcode: '2601',
      AddressState: 'ACT',
      BusinessName: ['Namadgi Entertainment'],
      EntityName: 'THE TRUSTEE FOR PSS FUND',
      EntityTypeCode: 'CSP',
      EntityTypeName: 'Commonwealth Government APRA Regulated Public Sector Scheme',
      Gst: '2000-07-01',
      Message: 'This could be anything coming from the Governement Registry'
    };
    complianceService.verifyComplianceDetails('abn', abn).subscribe((result) => {
      expect(result).toBe(expectedData);
    });
    // this shouldnt target a real API
    // const req = httpMock.expectOne(`https://devapi.gravityfusion.com.au/compliance/1.0/abn/${abn}`, 'call to api');
    // expect(req.request.method).toBe('GET');
    // req.flush(expectedData);
    // httpMock.verify();
  });
});
