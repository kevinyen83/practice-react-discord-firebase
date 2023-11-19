import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';

import { combineLatest, Subject, throwError } from 'rxjs';
import { takeUntil, tap, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from 'app/core/services/account/account.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateAccountModalComponent } from 'app/modules/pages/primary-account/create-account-modal/create-account-modal.component';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";

@Component({
  selector: 'primary-account-menu',
  templateUrl: './primary-account-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'primaryAccountMenu'
})
export class PrimaryAccountMenuComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_showAvatar: BooleanInput;

  @Input() showAvatar: boolean = true;

  currentAccount: any = {};
  menuOpened = false;
  accountList: any = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    combineLatest([this.accountService.currentAccount, this.accountService.listAccounts])
      .pipe(
        tap((res: any) => {
          console.log(res);
          if (res[0]?.uuid) {
            this.currentAccount = { ...res[0] };
          }
          if (this.currentAccount?.uuid && res[1]) {
            this.accountList = res[1];
          }
          this._changeDetectorRef.markForCheck();
        }),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe();
  }

  handleNewPrimaryAccount(): void {
    this.accountService.getAlertForCreateAccount();
    // const dialogRef = this.dialog.open(CreateAccountModalComponent, {
    //   data: {
    //     profile: this.userProfileService.currentUser.getValue()
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(result);
    // });
  }

  handleSwitchAccount(account): void {
    this.accountService
      .setCurrentAccount(account.uuid)
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.snackBar.open('You are no longer an Admin for this Account!', 'X', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
          return throwError(err);
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((res) => {
        // this.snackBar.open('Profile updated!', 'X', {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   horizontalPosition: 'center',
        // });
        this.router.navigate(['/pages/home']);
      });
  }

  isOpened(e) {
    this.menuOpened = true;
  }

  isClosed(e) {
    this.menuOpened = false;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
