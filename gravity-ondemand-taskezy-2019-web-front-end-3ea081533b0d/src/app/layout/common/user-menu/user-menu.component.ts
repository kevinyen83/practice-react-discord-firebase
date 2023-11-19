import { LoginService } from 'app/core/services/auth/login/login.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import {combineLatest, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService } from "../../../core/services/account/account.service";
// import { User } from 'app/core/user/user.model';
// import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'userMenu',
})
export class UserMenuComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_showAvatar: BooleanInput;

  @Input() showAvatar: boolean = true;
  @Input() showName: boolean = false;

  // user: User;
  user: any;

  // Invites
  invitations = [];
  badgeIsHidden = true;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private accountService: AccountService,
    public loginService: LoginService,
    private userProfileService: UserProfileService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    combineLatest([this.userProfileService.currentUser, this.accountService.invitations])
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((res: any[]) => {
        console.log('Current User: ', res);
        this.user = res[0];
        this.invitations = res[1];
        if (this.invitations.length > 0) {
          this.badgeIsHidden = false;
        } else {
          this.badgeIsHidden = true;
        }
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the user status
   *
   * @param status
   */
  updateUserStatus(status: string): void {
    // Return if user is not available
    if (!this.user) {
      return;
    }

    // Update the user
    // this.userProfileService.update({
    //     ...this.user,
    //     status
    // }).subscribe();
  }

  /**
   * Sign out
   */
  signOut(): void {
    this.loginService.signOut();
    // this._router.navigate(['/sign-out']);
  }

  /**
   * Profile
   */
  gotoProfile(): void {
    this._router.navigate(['/pages/profile']);
  }
}
