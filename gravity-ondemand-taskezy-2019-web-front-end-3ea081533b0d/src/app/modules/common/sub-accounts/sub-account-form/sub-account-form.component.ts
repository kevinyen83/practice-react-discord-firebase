import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";

import { fuseAnimations } from '@fuse/animations';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { HeaderButtonService } from 'app/core/services/header-with-button/header-with-button.service';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UtilService } from 'app/core/services/utils/util.service';

const VIEW_MODE_ABN_SEARCH = 'VIEW_MODE_ABN_SEARCH';
const VIEW_MODE_ACCOUNT_INFOR = 'VIEW_MODE_ACCOUNT_INFOR';
const VIEW_MODE_DETAIL = 'VIEW_MODE_DETAIL';

@Component({
  selector: 'app-sub-account-form',
  templateUrl: './sub-account-form.component.html',
  animations: fuseAnimations
})
export class SubAccountFormComponent implements OnInit, OnDestroy {
  @Input() type;

  @Output() changedHeader = new EventEmitter<string>();
  @Output() updateSubAccounts = new EventEmitter<any>();

  selectedAccount;
  status;
  headerAccount = '';
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert = false;

  abnForm: FormGroup;
  abnInfo;
  accountInfo;
  isExist: boolean;
  isAllow: boolean;
  currentAccount;
  spinnerSearch: boolean = false;

  notificationABN: string = '';
  viewMode = VIEW_MODE_ABN_SEARCH;
  viewAccountInfo: boolean = false;
  message: string = '';
  currentConnection: any;

  unsubscribeAll = new Subject<any>();

  constructor(
    public dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    private complianceService: ComplianceService,
    private utils: UtilService,
    private headerButtonService: HeaderButtonService
  ) {}

  ngOnInit() {
    this.headerButtonService.isAccountDetails.next('notDetails')
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildFormAbn();
    this.accountService.closedDrawer.subscribe((res) => {
      this.viewMode = VIEW_MODE_ABN_SEARCH;
      this.abnForm.reset();
      this.accountService.selectedAccount = {};
    });
    this.currentAccount = this.accountService.currentAccount.getValue();
    this.accountService.selectedAccount
      .pipe(
        takeUntil(this.unsubscribeAll),
        tap((res) => {
          this.selectedAccount = res;
          this.status = this.accountService.selectedAccountStatus.getValue();
        })
      )
      .subscribe();
  }

  buildFormAbn() {
    this.abnForm = new FormGroup({
      abn: new FormControl('', [
        this.utils.abnValidator(),
        Validators.pattern('^(\\d *?){11}$')])
    });
  }

  nextStep() {
    this.viewMode = VIEW_MODE_DETAIL;
  }

  savedDetails() {
    this.abnForm.reset();
    this.viewMode = VIEW_MODE_ABN_SEARCH;
    this.updateSubAccounts.emit();
  }

  backToClients() {
    this.router.navigate(['pages/list-clients']);
  }

  backToSuppliers() {
    this.router.navigate(['pages/list-suppliers']);
  }

  searchAbn() {
    this.showAlert = false;
    this.spinnerSearch = true;
    const abn = this.abnForm.get('abn').value;
    if (abn) {
      const newAbn = abn.replace(/\D/g, '');

      // if (newAbn.length > 11) {
      //   this.abnForm.get('abn').setErrors({ invalid: true });
      //   console.log(this.abnForm.get('abn'));
      //   this.spinnerSearch = false;
      //   return;
      // }

      if (this.currentAccount.detail.abn === newAbn) {
        this.abnForm.get('abn').setErrors({ self: true });
        this.spinnerSearch = false;
        return;
      }

      let existClient = this.currentAccount?.clients.find(cl => cl.detail.abn === newAbn);
      let existSupplier = this.currentAccount?.suppliers.find(s => s.detail.abn === newAbn);
      if (this.type === 'client' && existClient || this.type === 'supplier' && existSupplier) {
        this.abnForm.get('abn').setErrors({ alreadyConnected: true });
        this.spinnerSearch = false;
        return;
      } else if (this.type === 'client' && existSupplier) {
        this.confirmAction(this.type, 'Supplier', newAbn);
      } else if (this.type === 'supplier' && existClient) {
        this.confirmAction(this.type, 'Client', newAbn);
      } else {
        this.continueProcessAbn(newAbn);
      }
    } else {
      this.spinnerSearch = false;
    }
  }

  continueProcessAbn(newAbn) {
    this.accountService
      .isAccountExistsInTheSystem(newAbn)
      .pipe(
        tap({
          next: (res: any) => {
            this.verifyAbn(newAbn);
            if (res.status == 204 || res.status == 206) {
              this.message = `Please check the Account Information.If the information is correct continue creating the ${this.capitalizeFirstLetter(this.type)}.`;
              this.isExist = false;
            } else {
              this.message = `This account exists.\nWould you like to send a ${this.capitalizeFirstLetter(this.type)} connection request?`;
              this.isExist = true;
              this.currentConnection = res;
            }
            this.spinnerSearch = false;
          },
          error: (err) => {
            console.log(err);
            // if (err.status === 206) {
            //   this.isExist = false;
            //   this.verifyAbn(newAbn);
            // } else {
            const message = 'Error: ' + err.error.text || err.error;
            this.alert = {
              type: 'error',
              message: message
            };
            this.showAlert = true;
            // }
            this.spinnerSearch = false;
          }
        }),
        catchError((err) => {
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  confirmAction(name1, name2, abn) {
    const dialogRef = this._fuseConfirmationService.open({
      title: `The ${name1} already exists as a ${name2}`,
      message: `Are you sure you want to proceed?`,
      actions: {
        confirm: {
          show: true,
          label: `Yes`,
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    });
    return dialogRef.afterClosed().subscribe(res => {
      if (res === 'confirmed') {
        this.continueProcessAbn(abn);
      } else {
        this.spinnerSearch = false;
      }
    });
  }

  verifyAbn(abn) {
    this.complianceService
      .verifyComplianceDetails('abn', abn)
      .pipe(
        tap((res) => {
          if (res.Abn === '') {
            this.abnForm.get('abn').setErrors({ notFound: true });
            this.spinnerSearch = false;
          } else {
            this.abnInfo = res;
            this.accountInfo = {
              abn: this.abnInfo.Abn,
              name: this.abnInfo.EntityName,
              tradingname: this.abnInfo?.BusinessName[0],
              entitytype: this.abnInfo.EntityTypeName
            };
            this.abnForm.get('abn').patchValue(abn);
            // this.detailedInformation = true;
            this.viewMode = VIEW_MODE_ACCOUNT_INFOR;
            this.spinnerSearch = false;
            this.abnForm.get('abn').setErrors(null);
          }
          this.spinnerSearch = false;
        }),
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          const message = 'There was an error.';
          this.alert = {
            type: 'error',
            message: message
          };
          this.showAlert = true;
          this.spinnerSearch = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  // backToInfo() {
  //   this.viewMode = VIEW_MODE_ACCOUNT_INFOR;
  // }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  confirmAbn() {
    if (!this.isExist) {
      this.nextStep();
    } else {
      const dialogRef = this._fuseConfirmationService.open({
        title: `Connection request`,
        message: `Are you sure you want to invite ${this.accountInfo.name} as a ${this.capitalizeFirstLetter(this.type)}?`,
        actions: {
          confirm: {
            show: true,
            label: `Yes`,
            color: 'primary'
          },
          cancel: {
            show: true,
            label: 'Cancel'
          }
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res === 'confirmed') {
          let connection = {
            invited_account_uuid: this.currentConnection?.body?.uuid,
            message: "Hello, I would like to connect with you.",
            relationship: this.type,
            request_account_uuid: this.currentAccount?.uuid
          };
          this.accountService.addConnection(connection).subscribe(res => {
            this._snackBar.open(
              'Connection sent', 'X', {
                duration: 3000
              });
              this.accountService.refreshCurrentAccount();
            this.updateSubAccounts.emit();
          });
        }
      })
    }
  }

  backToAbn() {
    this.abnForm.reset();
    this.viewMode = VIEW_MODE_ABN_SEARCH;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
