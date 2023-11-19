import { Component, OnInit } from '@angular/core';

import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Subject, takeUntil } from 'rxjs';

import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { RosterService } from '../../../../core/services/roster/roster.service';
import { ComplianceService } from '../../../../core/services/compliance/compliance.service';

@Component({
  selector: 'app-accreditations-required',
  templateUrl: './accreditations-required.component.html'
})
export class AccreditationsRequiredComponent implements OnInit {
  listAccreditations = [];
  reserveAccreditations = [];

  private unsubscribeAll = new Subject();

  constructor(private suppliersService: SuppliersService, private complianceService: ComplianceService, private rosterService: RosterService) {}

  ngOnInit(): void {
    this.complianceService
      .checkAccreditation()
      .pipe(
        tap((res) => {
          this.listAccreditations = res;
          this.reserveAccreditations = [...this.listAccreditations];
        }),
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
