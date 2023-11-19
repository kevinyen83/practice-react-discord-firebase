import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-authority-invite-modal',
  templateUrl: './authority-invite-modal.component.html'
})
export class AuthorityInviteModalComponent implements OnInit {
  status;
  invitation;
  profile;

  constructor(public dialogRef: MatDialogRef<AuthorityInviteModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    console.log(data);
    if (data) {
      this.status = data.status;
      this.invitation = data.invitation;
      this.profile = data.profile;
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
}
