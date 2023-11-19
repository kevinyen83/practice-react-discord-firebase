import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, of, Subject, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from 'app/core/services/account/account.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-list-members',
  templateUrl: './list-members.component.html',
  animations: fuseAnimations
})
export class ListMembersComponent implements OnInit, OnDestroy {
  membersDataSource: MatTableDataSource<any>;
  addMemberForm: FormGroup = new FormGroup({});
  selectedAccount;
  currentAccount;
  notification = '';
  membersDisplayedColumns = [
    'name',
    'email',
    'phone',
    'role',
    'department',
    'status',
  ];
  // invitesDisplayedColumns = [
  //   "email",
  //   "role",
  //   "department"
  // ];
  roles = [
    { label: 'Resource', value: 0 },
    { label: 'Manager', value: 1 },
    { label: 'Assistant', value: 2 },
    { label: 'Administrator', value: 3 }
  ];
  @Output() goToDetails = new EventEmitter<any>();
  // @Input() members = [];
  // @Input() invites = [];
  @Input() accountType;

  isExternallyManaged = false;
  defaultAvatar;
  unsubscribeAll = new Subject<any>();
  inviteForm
  typeOfManagedEmail
  typeOfManagedConnectionStatus

  constructor(
    public utils: UtilService,
    private avatarService: AvatarService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private _fuseConfirmationService: FuseConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.defaultAvatar = this.avatarService.defaultAvatar;
  }

  ngOnInit(): void {
    this.typeOfManagedEmail = this.accountService?.selectedAccount?._value?.invitation?.email
    this.typeOfManagedConnectionStatus = this.accountService?.selectedAccount?._value?.connection_status
    this.buildForm();
    this.currentAccount = this.accountService.currentAccount.getValue();
    this.accountService.selectedAccount
      .pipe(
        // takeUntil(this.unsubscribeAll),
        switchMap((res) => {
          this.selectedAccount = res;
          if (this.selectedAccount?.detail?.abn) {
            return this.accountService.isAccountExistsInTheSystem(this.selectedAccount.detail.abn)
          } else {
            return of({});
          }
        }),
        tap((res: any) => {
          if (res && res?.body?.owner?.user_id) {
            this.isExternallyManaged = true;
          } else {
            this.isExternallyManaged = false;
          }
          if (this.selectedAccount.manged) {
            this.membersDataSource = new MatTableDataSource<any>([...this.selectedAccount.members].filter((inv) => inv.email != ''));
          } else {
            let invitations = [];
            let currentStatus = this.selectedAccount?.invitation?.status;
            if (currentStatus === 0 || currentStatus === 6 || currentStatus === 1 || currentStatus === 5) {

              invitations = [this.selectedAccount.invitation].filter(
                (inv) => inv.email !== '' && inv?.primary_account_id === this.currentAccount?.uuid);

            }
            this.membersDataSource =
              new MatTableDataSource<any>([...this.selectedAccount?.members, ...invitations]);
          }
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  sortData(event) {}

  // toAddMemberForm() {
  //   this.toForm.emit();
  // }

  // editMember(member) {
  //   this.toForm.emit(member);
  // }

  buildForm() {
    this.addMemberForm = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      email: this.formBuilder.control('', [
        Validators.email,
        Validators.required
      ])
    });
    // this.addMemberForm.get('role').disable();
  }

  // addInvite() {
  //   console.log('add called');
  //   (this.addMembersForm.get('invites') as FormArray).push(this.addInviteForm());
  // }

  // checkAndAddInvite(e) {
  //   console.log('check called');
  //   e.stopPropagation();
  //   e.preventDefault();
  //   const i = this.getControls().length;
  //   if(this.getControls()[i-1].valid) {
  //     this.addInvite();
  //   }
  // }

  getControls() {
    return (this.addMemberForm.get('invites') as FormArray).controls;
  }

  // addInviteForm() {
  //   return this.formBuilder.group({
  //     name: this.formBuilder.control('', Validators.required),
  //     email: this.formBuilder.control('', [Validators.email, Validators.required]),
  //     role: this.formBuilder.control(3, Validators.required),
  //     // department: this.formBuilder.control(''),
  //     sending: this.formBuilder.control(false),
  //     sent: this.formBuilder.control(false),
  //     error: this.formBuilder.control(false)
  //   });
  // }

  // removeInvite(i) {
  //   console.log('remove called');
  //   (this.addMembersForm.get('invites') as FormArray).removeAt(i);
  // }
  changeSelect(e,type){
console.log("check e: ", e)
if(e?.value=='external'){
this.inviteForm = true
}else if(e?.value=='internal'){
  this.inviteForm = false
}
  }

  sendInvite() {
    const invite = this.addMemberForm.value;
    const dialogRef = this._fuseConfirmationService.open({
      title: `Send Invitation`,
      message: `Do you want to send the invitation to ${invite?.email},\n This will replace any current External Management Invitations.`,
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
        let inv = {
          invite_email: invite?.email,
          invite_name: invite?.name
        };

        if (this.accountType === 'client') {
          this.accountService
            .updateInvitationClient(this.currentAccount.uuid, this.selectedAccount.uuid, inv)
            .pipe(
              tap((res) => {
                this.snackBar.open('The invitation is sent', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this.accountService.refreshCurrentAccount();
                this.addMemberForm.reset();
              }),
              catchError((err) => {
                console.log(err);
                this.snackBar.open('Error: ' + err.error, 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                return EMPTY;
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === 'supplier') {
          this.accountService
            .updateInvitationSupplier(this.currentAccount.uuid, this.selectedAccount.uuid, inv)
            .pipe(
              tap((res) => {
                this.snackBar.open('The invitation is sent', 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this.accountService.refreshCurrentAccount();
                this.addMemberForm.reset();
              }),
              catchError((err) => {
                console.log(err);
                this.snackBar.open('Error: ' + err.error, 'X', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                return EMPTY;
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        }
      }
    });
  }

  resendInvite(invite) {
    const dialogRef = this._fuseConfirmationService.open({
      title: `Resend the invitation`,
      message: `Do you want to resend the invitation to ${invite?.email}`,
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
        let inv = {
          invite_email: invite?.email,
          invite_name: invite?.invite_name
        };

        if (this.accountType === 'client') {
          this.accountService
            .updateInvitationClient(this.currentAccount.uuid, this.selectedAccount.uuid, inv)
            .pipe(
              tap((res) => {
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
            .updateInvitationSupplier(this.currentAccount.uuid, this.selectedAccount.uuid, inv)
            .pipe(
              tap((res) => {
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

  deleteMember() {
    this.goToDetails.emit();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
