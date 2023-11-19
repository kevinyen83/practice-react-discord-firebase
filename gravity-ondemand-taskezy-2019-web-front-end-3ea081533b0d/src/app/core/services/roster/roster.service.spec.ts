import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RosterService } from './roster.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';

describe('RosterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      FuseConfirmationService,
      {
        provide: MatDialog,
        useValue: {}
      }
    ]
  }));

  it('should be created', () => {
    const service: RosterService = TestBed.inject(RosterService);
    expect(service).toBeTruthy();
  });
});
