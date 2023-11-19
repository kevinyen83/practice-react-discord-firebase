import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Subject, takeUntil } from 'rxjs';
import { FuseAlertType } from '../../../../@fuse/components/alert';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AvatarService } from '../../../core/services/avatar/avatar.service';
import { AccountService } from '../../../core/services/account/account.service';
import { LoginService } from 'app/core/services/auth/login/login.service';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import firebase from 'firebase/compat/app';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-authority-verification',
  templateUrl: './authority-verification.component.html'
})
export class AuthorityVerificationComponent implements OnInit, OnDestroy {
  defaultAvatar;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert = false;
  disableConfirm = false;
  listFiles = [];

  fireStorage;

  @Input() status;
  @Input() invitation;
  @Input() profile;
  @Input() abnInfo;
  @Input() hideBack = false;
  @Output() back = new EventEmitter<any>();

  private unsubscribeAll = new Subject();
  // @Output() goToNextPage = new EventEmitter<any>();

  constructor(
    private router: Router,
    private avatarService: AvatarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private accountService: AccountService,
    public aFireStorage: AngularFireStorage,
    public loginService: LoginService,
    public utils: UtilService
  ) {
    this.fireStorage = this.aFireStorage.storage.app.storage('tboss-authact');
    // this.fireStorage = firebase.app().storage('gs://tboss-authact');
  }

  ngOnInit(): void {
    this.defaultAvatar = this.avatarService.defaultAvatar;
    if (this.status == 'primary-account') {
    } else if (this.status === 'external-manager') {
      this.getAbnExternal(this.invitation);
    }
  }

  getAbnExternal(invite) {
    this.abnInfo = {
      Abn: invite.account_abn,
      EntityName: invite.account_name,
      BusinessName: [invite.trading_name],
      EntityTypeName: invite?.sub_account_detail?.entitytype, // Discuss with Nick
      industry: invite?.sub_account_detail?.industry // Discuss with Nick
    };
  }

  confirmDocuments() {
    if (this.status === 'primary-account') {
      this.disableConfirm = false;
      // const accountInfo = {
      //   abn: this.abnInfo.Abn,
      //   name: this.abnInfo.EntityName,
      //   tradingname: this.abnInfo?.BusinessName[0],
      //   entitytype: this.abnInfo.EntityTypeName
      // };
      // // this.accountService.newAccount = accountInfo;
      // // need to create the primary account, then upload the documents that were chosen
      // this.accountService
      //   .createPrimaryAccount(accountInfo)
      //   .pipe(
      //     catchError((error) => {
      //       console.log('app comp', error);
      //       let message = '';
      //       if (error.status == 500 && error.error.includes('duplicate key')) {
      //         message = 'This is an existing Account. Please check the ABN entered.\nIf you want to dispute the existing Account, please contact TaskEzy immediately.';
      //       } else {
      //         message = 'There was an error. Please try again later.';
      //         this.disableConfirm = false;
      //       }
      //       this.alert = {
      //         type: 'error',
      //         message: message
      //       };
      //       this.showAlert = true;
      //       return EMPTY;
      //     })
      //   )
      //   .subscribe();
      // TODO: upload the documents to this account, needs to be created first.
    } else if (this.status === 'external-manager') {
      console.log("external manager invite --", this.invitation)
      this.accountService
        .acceptMyAccountExternalManageInvite(this.invitation)
        .pipe(
          tap((res) => {
            // this.accountService.setCurrentAccount(this.invitation.account_uuid);
            this.invitation.verifying = true;
            this.disableConfirm = false;
            // this.goToNextPage.emit('verifying-now');
            // accept, then upload the documents that were chosen, then go back and mark that invite as "veryfying"
            this.back.emit('success');
          }),
          catchError((err) => {
            console.log(err);
            this.disableConfirm = false;
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  saveFiles(event) {
    let { files, res } = event
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const exists = this.listFiles.findIndex((file) => file.name == files[i].name && file.size == files[i].size);
        if (exists >= 0) {
          this.listFiles.splice(exists, 1);
        }
        this.listFiles.push(files[i]);
      }
    }
  }

  deleteFile(i) {
    this.listFiles.splice(i, 1);
  }

  goBack() {
    this.back.emit();
  }

  // resetDocuments() {
  //   this.reset.emit();
  // }

  putStorageItem(input) {
    const fileExt = input.name.split('.').slice(-1);
    // the return value will be a Promise
    const filepath = `taskezy/authoritytoact/${this.profile.id}/${this.invitation.account_id}/authorityUpload-${this.utils.randomString(5)}.${fileExt}`;
    let task = this.fireStorage.ref(filepath).put(input, {
      contentType: input.type,
      customMetadata: {
        originalName: input.name,
        env: this.utils.getEnv(),
        accountName: this.invitation?.account_name,
        accounttradingname: this.invitation?.trading_name,
        accountPhone: this.invitation?.account_phone,
        accountAddress: this.invitation?.account_address,
        accountAbn: this.invitation?.account_abn,
        userFullName: this.profile.fullName,
        userUUID: this.profile.id,
        userEmail: this.profile.email,
        inviteUUID: this.invitation.invite_id
      }
    });

    task.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        input.fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      }
    );
    return task;
  }

  handleSave() {
    this.showAlert = false;
    this.disableConfirm = true;
    this.loginService
      .loginToFirebase()
      .pipe
      // takeUntil(this.unsubscribeAll)
      ()
      .subscribe(() => {
        Promise.all(this.listFiles.map((file) => this.putStorageItem(file)))
          .then((url) => {
            const data: FuseConfirmationConfig = {
              title: 'Successfully Uploaded Documents.',
              message: '',
              icon: {
                show: false
              },
              actions: {
                confirm: {
                  show: true,
                  label: 'Ok',
                  color: 'primary'
                },
                cancel: {
                  show: false
                }
              }
            };
            let dialog = this._fuseConfirmationService.open(data);
            this.confirmDocuments();
          })
          .catch((error) => {
            console.log(`Some failed: `, error.message);
            const data: FuseConfirmationConfig = {
              title: 'Upload Failed',
              message: 'Something went wrong uploading the documents.',
              icon: {
                show: false
              },
              actions: {
                confirm: {
                  show: true,
                  label: 'Ok',
                  color: 'primary'
                },
                cancel: {
                  show: false
                }
              }
            };
            let dialog = this._fuseConfirmationService.open(data);
            this.disableConfirm = false;
          });
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
