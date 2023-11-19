import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { fuseAnimations } from '@fuse/animations';

import { LoginService } from 'app/core/services/auth/login/login.service';
import { AccountService } from 'app/core/services/account/account.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvatarService } from '../../../core/services/avatar/avatar.service';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WelcomeComponent implements OnInit, OnDestroy {
  invitations = [];
  interviews = [];
  currentUser;
  viewVerifyingNow: boolean = false;
  viewAutorityVerification: boolean = false;
  unsubscribeAll = new Subject<any>();
  notification = new Subject<string>();
  client_invitations = [];
  supplier_invitations = [];

  defaultAvatar;
  viewConnections = false;
  asResource = false;
  hasInvites = false;
  currentOneList = [];
  resultChunks = [];
  currentPage: number = 0;
  designCard = 'default';

  invitation;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private avatarService: AvatarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private snackBar: MatSnackBar,
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private loginService: LoginService,
    public utils: UtilService
  ) {}

  ngOnInit(): void {
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.userProfileService.currentUser
      .pipe(
        switchMap((res) => {
          this.currentUser = res;
          return this.accountService.invitations;
        }),
        tap((res: any[]) => {
          if (res) {
            this.invitations = res.map((invite) => {
              invite.designCard = 'default';
              return invite;
            });
            this.getList(this.currentPage);
            // }
            this.hasInvites = this.invitations?.length > 0;
          }
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  goToMyConnections() {
    this.viewConnections = true;
  }

  backFromConnections() {
    this.viewConnections = false;
  }

  acceptInvite(invite, index) {
    invite.spinner = true;
    const data: any = {
      title: 'Accept Connection',
      message: 'Do you want to accept this connection request?',
      icon: {
        show: false
        // color: 'primary'
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
    };
    let dialog = this._fuseConfirmationService.open(data);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        if (invite.role != "External Manager") {
            this.accountService
            .acceptMyAccountInvite(invite)
            .pipe(
              tap((res) => {
                invite.spinner = false;
                this.snackBar.open('The invitation is accepted', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this.currentOneList[index].designCard = 'accept';
                this.accountService.getMyAccountInvites();
              })
            )
            .subscribe();
        } else {
          this.invitation = invite;
          this.viewAutorityVerification = true;
          invite.spinner = false;
          //go to authority page
        }
      } else {
        invite.spinner = false;
      }
    });
  }

  declineInvite(invite, index) {
    invite.spinner = true;
    const data: any = {
      title: 'Decline Connection',
      message: 'Are you sure you want to decline the connection request?',
      icon: {
        show: false
        // color: 'primary'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes'
          // color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    };
    let dialog = this._fuseConfirmationService.open(data);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        if (invite.role != "External Manager") {
          this.accountService
            .declineMyAccountInvite(invite)
            .pipe(
              tap((res) => {
                invite.spinner = false;
                this.snackBar.open('The invitation is declined', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this.currentOneList[index].designCard = 'decline';
                this.accountService.getMyAccountInvites();
              })
            )
            .subscribe();
        } else {
          this.accountService
            .declineMyAccountExternalManageInvite(invite)
            .pipe(
              tap((res) => {
                invite.spinner = false;
                this.snackBar.open('The invitation is declined', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this.currentOneList[index].designCard = 'decline';
                this.accountService.getMyAccountInvites();
              })
            )
            .subscribe();
        }
      } else {
        invite.spinner = false;
      }
    });
  }

  confirmExternal(invite, index) {
    const data: any = {
      title: 'Confirm Ownership',
      message: 'Do you want to confirm taking ownership of this account?',
      icon: {
        show: false
        // color: 'primary'
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
    };
    let dialog = this._fuseConfirmationService.open(data);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        this.accountService
          .confirmMyAccountExternalManageInvite(invite)
          .pipe(
            switchMap((res) => {
              this.snackBar.open('The Ownership is accepted', 'X', {
                duration: 2000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
              this.currentOneList[index].designCard = 'accept';
              this.accountService.getMyAccountInvites();
              return this.accountService.getAllAccounts();
            })
          )
          .subscribe();
      }
    });
  }

  hideInvite(invite, i) {
    const data: any = {
      title: 'Hide Invite',
      message: 'Are you sure you want to hide this invite?\nYou will be able to see this invite next time you log in.',
      icon: {
        show: false
        // color: 'primary'
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
    };
    let dialog = this._fuseConfirmationService.open(data);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        // invite.hidden = true;
        this.invitations.splice(i, 1);
        this.getList(this.currentPage);
      }
    });
  }

  getList(page) {
    this.currentPage = page;
    this.resultChunks = _.chunk(this.invitations, 3);
    this.currentOneList = this.resultChunks[page];
  }

  goToNextPage(event) {
    switch (event) {
      case 'verifying-now':
        this.viewAutorityVerification = false;
        this.viewVerifyingNow = true;
        break;
      case 'welcome':
        this.viewAutorityVerification = false;
        this.viewVerifyingNow = false;
        break;
    }
  }

  resetAuthorityVerification() {
    this.accountService.getMyAccountInvites();
    this.viewAutorityVerification = false;
  }

  logout() {
    this.loginService.signOut();
  }

  // openModal(name, e) {
  //   //open the policy type based on name in modal to be read and closed.
  //   e.stopPropagation();
  //   e.preventDefault();
  //   let dialogOpts = new MatDialogConfig();
  //   dialogOpts.width = '65%';
  //   dialogOpts.maxHeight = '90vh';

  //   if (name === 'privacy_policy') {
  //     const dialog = this.dialog.open(PrivacyPolicyComponent, dialogOpts);
  //   } else if (name === 'terms_conditions') {
  //     const dialog = this.dialog.open(TermsConditionsComponent, dialogOpts);
  //   }
  // }

  createPrimary() {
    this.accountService.getAlertForCreateAccount();
    // this.router.navigate(['/create/primary-account']);
  }

  imAResource() {
    this.asResource = !this.asResource;
  }

  toBackCall() {
    this.asResource = false;
  }

  signOut() {
    this.loginService.signOut();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
