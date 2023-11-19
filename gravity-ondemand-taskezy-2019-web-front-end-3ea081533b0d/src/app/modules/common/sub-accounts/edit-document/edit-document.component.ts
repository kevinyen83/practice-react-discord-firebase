import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AccountService } from "../../../../core/services/account/account.service";

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html'
})
export class EditDocumentComponent implements OnInit {
  status = 'editOne';
  accountType = '';

  constructor(private dialogRef: MatDialogRef<EditDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private accountService: AccountService) {
                if (data && data.accountType) {
                  this.accountType = data.accountType;
                }
              }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }


  save(doc) {
    this.dialogRef.close(doc);
  }

}
