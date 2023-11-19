import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { FuseConfirmationService } from "../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

import { HeaderButtonService } from './header-with-button.service';

describe('HeaderButtonService', () => {
  let service: HeaderButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: {} }
      ]
    });
    service = TestBed.inject(HeaderButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
