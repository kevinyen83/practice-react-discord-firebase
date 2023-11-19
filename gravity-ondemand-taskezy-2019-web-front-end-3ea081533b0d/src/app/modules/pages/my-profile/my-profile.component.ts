import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { combineLatest, EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { LoginService } from 'app/core/services/auth/login/login.service';
import { ResetPasswordService } from 'app/core/services/auth/reset-password/reset-password.service';
import { environment } from 'environments/environment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UtilService } from 'app/core/services/utils/util.service';
import { AuthorityInviteModalComponent } from 'app/modules/common/authority-invite-modal/authority-invite-modal.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MyProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild('postalAddress', { read: true, static: false }) postalAddress;
  // @ViewChild('address', { read: true, static: false }) address;
  public searchElementRef: ElementRef;

  public searchPostalElementRef: ElementRef;
  minDate: Date;
  maxDate: Date;

  userForm: FormGroup;
  changePasswordForm: FormGroup;

  changePasswordErrorMessage;
  invitations = [];
  memberships = []

  currentUser: any;
  saved = true;
  zoom: number;
  status: string;
  tenant = environment.tenant;
  private unsubscribeAll = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private loginService: LoginService,
    private resetPasswordService: ResetPasswordService,
    private snackBar: MatSnackBar,
    private _fuseConfirmationService: FuseConfirmationService,
    private dialog: MatDialog,
    public utils: UtilService
  ) {}

  ngOnInit() {
    this.minDate = moment().subtract(70, 'years').toDate();
    this.maxDate = moment().subtract(18, 'years').toDate();
    this.createmyProfileForm();
    this.createChangePasswordForm();
    // const emailForUser = localStorage.getItem("email");

    combineLatest([
      this.userProfileService.currentUser,
      this.accountService.invitations,
      this.accountService.memberships
    ])
      .pipe(
        tap((res: any[]) => {
          this.currentUser = res[0];
          this.invitations = res[1];
          this.memberships = res[2];
          if (this.currentUser.firstName) {
            this.status = 'edit';
            this.userForm.patchValue(
              {
                ['firstName']: this.currentUser.firstName,
                ['lastName']: this.currentUser.lastName,
                // ["birth"]: this.currentUser.birthday.toLocaleString(),
                ['email']: this.currentUser.email,
                ['mobileNumber']: this.currentUser.mobilePhone
              },
              { onlySelf: true }
            );
          }
          this.userForm.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe((val) => {
            this.saved = false;
          });
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.accountService.getMyAccountInvites();
  }

  getStatusClass(status) {
    if(status == 'Pending') {
      return `border py-1 px-3 ml-3 rounded-full text-sm  bg-orange-100 text-orange-500`
    }

    if(status == 'Active') {
      return `border py-1 px-3 ml-3 rounded-full text-sm  bg-green-100 text-green-500`
    }

    return `border py-1 px-3 ml-3 rounded-full text-sm ${status}`
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.saved) {
      // const data = {
      //   title: "You have unsaved Changes",
      //   message: "Would you like to save your changes?",
      //   buttons: [
      //     {
      //       color: "accent",
      //       title: "Don't Save",
      //       value: false,
      //     },
      //     {
      //       color: "accent",
      //       title: "Save",
      //       value: true,
      //     },
      //   ],
      // };
      const dialogRef = this._fuseConfirmationService.open({
        title: `You have unsaved Changes`,
        message: `Would you like to save your changes?`,
        actions: {
          confirm: {
            show: true,
            label: `Save`,
            color: 'primary'
          },
          cancel: {
            show: true,
            label: "Don't Save"
          }
        }
      });
      // const dialogRef = this.dialog.open(ConfirmActionComponent, {
      //   data,
      // });
      return dialogRef.beforeClosed().pipe(
        tap((res) => {
          if (res) {
            // this.saveMyProfile();
            return true;
          } else {
            return false;
          }
        })
      );
    } else {
      return true;
    }
  }

  createmyProfileForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: [
        '',
        Validators.required
      ],
      lastName: [''],
      birth: [
        '',
        Validators.required
      ],
      mobileNumber: [
        '',
        Validators.required
      ], //phone format validation is built into ngx-mat-intl-tel-input
      email: [
        { value: '', disabled: true },
        [
          Validators.email,
          Validators.required
        ]
      ]
    });
  }

  createChangePasswordForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [
        '',
        Validators.required
      ],
      newPassword: [
        '',
        [
          differentNewPasswordValidator,
          Validators.required
        ]
      ],
      confirmPassword: [
        '',
        [
          confirmPasswordValidator,
          Validators.required
        ]
      ]
    });
  }

  acceptInvite(invite) {
    invite.spinner = true;

    if (invite.role != "External Manager") {
      this.accountService
        .acceptMyAccountInvite(invite)
        .pipe(
          tap((res) => {
            this.accountService.getMyAccountInvites();
            invite.spinner = false;
          }),
          catchError((err) => {
            console.log(err);
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else {
      const dialogRef = this.dialog.open(AuthorityInviteModalComponent, {
        data: {
          profile: this.currentUser,
          status: 'external-manager',
          invitation: invite
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.accountService.getMyAccountInvites();
        invite.spinner = false;
      });
    }
  }

  declineInvite(invite) {
    invite.spinner = true;
    if (invite.role != "External Manager") {
      this.accountService
        .declineMyAccountInvite(invite)
        .pipe(
          tap((res) => {
            this.accountService.getMyAccountInvites();
            invite.spinner = false;
          }),
          catchError((err) => {
            invite.spinner = false;
            console.log(err);
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else {
      this.accountService
        .declineMyAccountExternalManageInvite(invite)
        .pipe(
          tap((res) => {
            this.accountService.getMyAccountInvites();
            invite.spinner = false;
          }),
          catchError((err) => {
            invite.spinner = false;
            console.log(err);
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  confirmInvite(invite) {
    if (invite.role == "External Manager") {
      invite.spinner = true;
      this.accountService
        .confirmMyAccountExternalManageInvite(invite)
        .pipe(
          // takeUntil(this.unsubscribeAll),
          switchMap((res) => {
            invite.spinner = false;
            this.accountService.getMyAccountInvites();
            return this.accountService.getAllAccounts();
          }),
          catchError((err) => {
            console.log(err);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  // updateInvitations(invite) {
  //   this.invitations = this.invitations.filter(i => i.account_uuid !== invite.account_uuid);
  // }

  saveMyProfile(userForm) {
    const myProfile = {
      id: this.currentUser.id,
      imageUrl: this.currentUser.imageUrl,
      firstName: userForm.get('first_name').value,
      lastName: userForm.get('last_name').value,
      mobileNumber: userForm.get('mobile_number').value,
      address: userForm.get('address').value
    };
    this.userProfileService
      .updateUserProfile(myProfile)
      .pipe(
        tap((data: any) => {
          this.snackBar.open('Account updated!', 'X', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.saved = true;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  changeMyPassword() {
    this.changePasswordErrorMessage = null;
    const changePassword = this.changePasswordForm.value;
    this.resetPasswordService
      .resetPassword(changePassword)
      .pipe(
        switchMap((res) => {
          const user = {
            loginId: localStorage.getItem('email'),
            password: changePassword.newPassword
          };
          return this.loginService.signIn(user);
        }),
        catchError((err) => {
          console.log(err);
          this.changePasswordForm.get('oldPassword').setErrors({ wrongPassword: 'wrongPassword' });
          this.changePasswordErrorMessage = err.error;
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        this.snackBar.open('Password Changed!', 'X', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.changePasswordForm.reset();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('newPassword') || control.parent.get('password');
  const passwordConfirm = control.parent.get('confirmPassword');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};

export const differentNewPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const newPassword = control.parent.get('newPassword');
  const oldPassword = control.parent.get('oldPassword');

  if (!newPassword || !oldPassword) {
    return null;
  }

  if (newPassword.value === '') {
    return null;
  }

  if (newPassword.value !== oldPassword.value) {
    return null;
  }

  return { passwordCantBeSame: true };
};
