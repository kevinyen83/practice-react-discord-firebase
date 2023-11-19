import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { ComplianceService } from '../../../core/services/compliance/compliance.service';

@Component({
  selector: 'app-add-accreditation-to-role',
  templateUrl: './add-accreditation-to-role.component.html'
})
export class AddAccreditationToRoleComponent implements OnInit, OnDestroy {
  selectedLicence = [];
  listAccreditations = [];
  reserveAccreditations = [];

  private unsubscribeAll = new Subject();

  constructor(private complianceService: ComplianceService, public dialogRef: MatDialogRef<AddAccreditationToRoleComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

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

  close() {
    this.dialogRef.close();
  }

  saveAccreditations() {
    this.dialogRef.close(this.selectedLicence);
  }

  sendAccreditations(events) {
    this.selectedLicence = events;
    this.dialogRef.close(this.selectedLicence);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
