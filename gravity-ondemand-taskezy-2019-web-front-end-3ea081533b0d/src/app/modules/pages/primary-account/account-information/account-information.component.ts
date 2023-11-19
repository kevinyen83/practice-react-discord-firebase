import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import {EMPTY, finalize, firstValueFrom, Subject} from 'rxjs';

import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseAlertType } from '@fuse/components/alert';
import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  animations: fuseAnimations
})
export class AccountInformationComponent implements OnInit, OnDestroy {
  abnForm: FormGroup;
  abnInfo;
  message: string = '';
  detailedInformation: boolean = false;
  spinnerSearch: boolean = false;
  unsubscribeAll = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert = false;
  disableConfirm;
  isExist = false;

  currAccnt: any = {};
  currAccnts: any[] = [];

  @Output() setAbnInfo = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<string>();

  constructor(private utils: UtilService, private complianceService: ComplianceService, private accountService: AccountService, private refreshService: RefreshService, private router: Router) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildFormAbn();

    this.currAccnt = this.accountService.currentAccount.getValue();
    this.accountService.listAccounts
    .pipe(
      tap((res:any) => this.currAccnts = res)
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

  searchAbn() {
    this.showAlert = false;
    this.spinnerSearch = true;
    // this.disableConfirm = false;
    const abn = this.abnForm.get('abn').value;

    if (abn) {
      const newAbn = abn.replace(/\D/g, '');

      // if (newAbn.length > 11) {
      //   this.abnForm.get('abn').setErrors({ invalid: true });
      //   this.spinnerSearch = false;
      //   return;
      // }

      console.log('current account ---', this.currAccnt);
      console.log('current account list ---', this.currAccnts);
      if (this.currAccnt?.detail?.abn === abn) {
        this.abnForm.get('abn').setErrors({ self: true });
        this.spinnerSearch = false;
        return;
      }

      const connectedAbns = [...this.currAccnts.map((accnt) => accnt.detail.abn)];

      if (connectedAbns.includes(abn)) {
        this.abnForm.get('abn').setErrors({ alreadyConnected: true });
        this.spinnerSearch = false;
        return;
      }

      this.accountService
        .isAccountExistsInTheSystem(newAbn)
        .pipe(
          tap({
            next: (res: any) => {
              this.verifyAbn(newAbn);
              if (res.status == 204 || res.status == 206) {
                this.message = 'Please check the account information.\n' + "Press “Confirm” if the information is correct or “Reset” if it doesn't refer to your business";
                this.disableConfirm = false;
              } else {
                this.message = 'This is an existing Account. Please check the ABN entered.\nIf you want to dispute the existing Account, please contact TaskEzy immediately.';
                this.disableConfirm = true;
              }
              this.spinnerSearch = false;
            },
            error: (err) => {
              console.log(err);
              // if (err.status === 206) {
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
    } else {
      this.spinnerSearch = false;
    }
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
            this.abnForm.get('abn').patchValue(abn);
            this.detailedInformation = true;

            this.spinnerSearch = false;
            this.abnForm.get('abn').setErrors(null);
          }
          this.spinnerSearch = false;
        }),
        catchError((err) => {
          console.log(err);
          const message = 'There was an error.';
          this.alert = {
            type: 'error',
            message: message
          };
          this.showAlert = true;
          this.spinnerSearch = false;
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {});
  }

  createPrimaryAccount() {
    this.setAbnInfo.emit(this.abnInfo);
    const accountInfo = {
      abn: this.abnInfo.Abn,
      name: this.abnInfo.EntityName,
      tradingname: this.abnInfo?.BusinessName[0],
      entitytype: this.abnInfo.EntityTypeName
    };
    // this.accountService.newAccount = accountInfo;
    // need to create the primary account, then upload the documents that were chosen

    this.accountService
      .createPrimaryAccount(accountInfo)
      .pipe(
        switchMap((res: any) => {
          return this.accountService.setCurrentAccount(res.uuid);
        }),
        switchMap((res) => {
          this.disableConfirm = false;
          this.nextStep.emit();
          //TODO: create them emit to allow verifications to be uploded, or to the extra info page (address phone etc)
          return this.refreshService.refreshWithRefreshToken();
        }),
        tap((res) => {
          this.router.navigate(['/']);
        }),
        // tap((res: any) => {
        //   this.accountService
        //     .setCurrentAccount(res.uuid)
        //     .pipe(
        //       tap(() => {
        //         this.disableConfirm = false;
        //         this.nextStep.emit();
        //         //TODO: create them emit to allow verifications to be uploded, or to the extra info page (address phone etc)
        //         this.refreshService
        //           .refreshWithRefreshToken()
        //           .pipe(
        //             tap(() => {
        //               this.resetAbn();
        //               this.router.navigate(['/']);
        //             })
        //           )
        //           .subscribe();
        //       })
        //     )
        //     .subscribe();
        // }),
        catchError((error) => {
          console.log('app comp', error);
          let message = '';
          if (error.status == 500 && error.error.includes('duplicate key')) {
            message = 'This is an existing Account. Please check the ABN entered.\nIf you want to dispute the existing Account, please contact TaskEzy immediately.';
          } else {
            message = 'There was an error. Please try again later.';
            this.disableConfirm = false;
          }
          this.alert = {
            type: 'error',
            message: message
          };
          this.showAlert = true;
          return EMPTY;
        }),
        finalize(() => {
          this.resetAbn();
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  resetAbn() {
    this.abnForm.reset();
    this.showAlert = false;
    this.detailedInformation = false;
    this.disableConfirm = false;
    // this.accountService.detailedInformation = false;
  }

  confirmAbn() {
    this.disableConfirm = true;
    this.createPrimaryAccount();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
