import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html'
})
export class CreateAccountModalComponent implements OnInit {
  abnInfo;
  viewAccountInformation = true;
  viewAutorityVerification = false;
  viewVerifyingNow = false;
  currentUser;

  constructor(public userProfileService: UserProfileService, public dialogRef: MatDialogRef<CreateAccountModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    console.log(data);
    if (data) {
      this.currentUser = data.currentUser;
    }
  }

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  save(e) {
    console.log(e);
    this.dialogRef.close(e);
  }

  setAbnInfo(e) {
    this.abnInfo = e;
  }

  goToNextPage(event) {
    if (event === 'authority-verification') {
      this.viewAutorityVerification = true;
      this.viewAccountInformation = false;
      this.viewVerifyingNow = false;
    } else if (event === 'verifying-now') {
      this.viewAutorityVerification = false;
      this.viewAccountInformation = false;
      this.viewVerifyingNow = true;
    }
  }
}
