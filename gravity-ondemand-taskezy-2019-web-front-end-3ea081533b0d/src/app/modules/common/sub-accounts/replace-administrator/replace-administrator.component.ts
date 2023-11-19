import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { AccountService } from '../../../../core/services/account/account.service';

@Component({
  selector: 'app-replace-administrator',
  templateUrl: './replace-administrator.component.html'
})
export class ReplaceAdministratorComponent implements OnInit {
  newInviteSupplier;
  viewSpinner = false;
  newInviteClient;
  _selectedAccount;
  replaceAdminForm: FormGroup;
  @Output() backToList = new EventEmitter<any>();
  @Input() accountType;
  @Input() currentAccount;
  @Input() set selectedAccount(value) {
    if (value) {
      this._selectedAccount = value;
    }
  }

  private unsubscribeAll = new Subject();

  constructor(private _fuseConfirmationService: FuseConfirmationService, private accountService: AccountService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.buildForm();
  }

  toClose() {
    this.backToList.emit();
  }

  buildForm() {
    this.replaceAdminForm = new FormGroup({
      nameAdministrator: new FormControl(''),
      emailAdministrator: new FormControl('')
    });
  }

  invite() {
    const dialogRef = this._fuseConfirmationService.open({
      title: `Replace the Administrator`,
      message: `Do you want to replace the administrator with the new one?`,
      icon: {
        show: false
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        this.viewSpinner = true;
        let inv = {
          invite_email: this.replaceAdminForm.get('emailAdministrator').value,
          invite_name: this.replaceAdminForm.get('nameAdministrator').value
        };

        if (this.accountType === 'client') {
          this.accountService
            .updateInvitationClient(this.currentAccount.uuid, this._selectedAccount.uuid, inv)
            .pipe(
              tap((res: any) => {
                // this.newInviteClient = res?.invitation;
                // this._selectedAccount.invitation = this.newInviteClient;
                // this.accountService.selectedAccount = this._selectedAccount;
                this.accountService.refreshCurrentAccount();
                this.viewSpinner = false;
                this.snackBar.open('The invitation is sent', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === 'supplier') {
          this.accountService
            .updateInvitationSupplier(this.currentAccount.uuid, this._selectedAccount.uuid, inv)
            .pipe(
              tap((res: any) => {
                // this.newInviteSupplier = res?.invitation;
                // this._selectedAccount.invitation = this.newInviteSupplier;
                // this.accountService.selectedAccount = this._selectedAccount;
                this.accountService.refreshCurrentAccount();
                this.viewSpinner = false;
                this.snackBar.open('The invitation is sent', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        }
      }
    });
  }

  cancel() {
    this.toClose();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
