import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// import { MatDialogRef } from "@angular/material/dialog";
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Observable } from 'rxjs';

import { RosterService } from '../../../../core/services/roster/roster.service';
import { AppSettings } from 'app/settings/app-settings';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-release-roster',
  templateUrl: './release-roster.component.html'
})
export class ReleaseRosterComponent implements OnInit {
  releaseForm: FormGroup;
  dateOfReleaseRoster = new Date();
  currentShift;
  clients = [];
  suppliers = [];

  valueRelease: string;
  currentClient: any;
  unsubscribeAll = new Subject<any>();
  filteredOptions: Observable<string[]>;
  currentAccount;
  title = 'Release Task';

  @Input() header;
  @Input() viewMode;
  @Output() closeSideNav = new EventEmitter<any>();
  @Output() releaseTasks = new EventEmitter<any>();

  constructor(private rosterService: RosterService, private _fuseConfirmationService: FuseConfirmationService, private accountService: AccountService) {}

  ngOnInit() {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    if (this.viewMode === AppSettings.ROSTER_VIEW_MODE_CLIENT) {
      this.title = 'Release Shift';
    }

    this.buildForm();
    this.accountService.currentAccount
      .pipe(
        switchMap((res: any) => {
          this.currentAccount = res;
          this.clients = this.currentAccount.clients || [];
          this.suppliers = this.currentAccount.suppliers || [];
          // this.filteredOptions = this.releaseForm
          //   .get('clientName')
          //   .valueChanges.pipe(
          //     startWith(""),
          //     map((value) => this._filterClients(value))
          //   );
          return this.rosterService.currentShift;
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.currentShift = res;
        if (this.currentShift.uuid) {
          this.currentClient = this.clients.find((cl) => cl.uuid === this.currentShift.client_uuid);
        }
      });
  }

  releaseRosterAndClose() {
    // this.dialogRef.close();
    const dialogRef = this._fuseConfirmationService.open({
      title: `Confirm`,
      message: `Are you sure you want to release the task?`,
      actions: {
        confirm: {
          show: true,
          label: `Yes, release`,
          color: 'primary'
        },
        cancel: {
          show: true,
          label: `Cancel`
        }
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((res) => {
          this._fuseConfirmationService.open({
            title: ``,
            message: `The Shift is released.`
          });
          this.closeSideNav.emit();
        }),
        // takeUntil(this/.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  buildForm() {
    this.releaseForm = new FormGroup({
      releaseTo: new FormControl(''),
      // clientName: new FormControl(''),
      view: new FormControl(false)
    });
  }

  close() {
    // this.dialogRef.close();
    this.closeSideNav.emit();
  }

  changeField(event) {
    this.valueRelease = event.value;
    // this.releaseForm.get('clientName').patchValue('');
  }

  // selectedValueName(value) {
  //   let val = value;
  // }

  _filterClients(value: string): string[] {
    const filterValue = value?.toLowerCase();

    if (this.valueRelease === 'Client') {
      return this.clients.filter((option) => option.detail.name.toLowerCase().includes(filterValue));
    }
    if (this.valueRelease === 'Supplier') {
      return this.suppliers.filter((option) => option.detail.name.toLowerCase().includes(filterValue));
    }
    if (this.valueRelease === 'Client and supplier') {
      let clientsAndSuppliers = [
        ...this.suppliers,
        ...this.clients
      ];
      return clientsAndSuppliers.filter((option) => option.detail.name.toLowerCase().includes(filterValue));
    }
  }

  ngOnDestroy() {
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
