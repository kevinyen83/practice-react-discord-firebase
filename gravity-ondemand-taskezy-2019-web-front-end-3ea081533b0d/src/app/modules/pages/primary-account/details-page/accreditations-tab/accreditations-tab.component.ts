import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EMPTY, Observable, of, Subject } from "rxjs";
import { takeUntil, tap, switchMap, catchError } from "rxjs/operators";

import { AccountService } from '../../../../../core/services/account/account.service';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import { ImagePreviewComponent } from 'app/modules/common/image-preview/image-preview.component';

@Component({
  selector: 'app-accreditations-tab',
  templateUrl: './accreditations-tab.component.html'
})
export class AccreditationsTabComponent implements OnInit, OnDestroy {
  @Input() listAccreditations;
  @Output() onDelete = new EventEmitter<any>();

  private unsubscribeAll = new Subject();

  constructor(private accountService: AccountService, private documentService: DocumentsService, public dialog: MatDialog) {}

  ngOnInit(): void {
  
  }

  deleteFile(indexAccred) {
    const curentAccount = this.accountService.currentAccount.getValue();
    let currAccred = this.listAccreditations[indexAccred];
    this.accountService
      .deleteAccountFormData(curentAccount.uuid, currAccred.uuid)
      .pipe(
        tap((res) => {
          this.listAccreditations = this.listAccreditations.filter((a, i) => i !== indexAccred);
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  parsingData(item) {
    if (item && typeof item === 'string') {
      let tag = JSON.parse(item);
      return tag;
    } else {
      return { type: '' };
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  handleRemove(accreditation) {
    this.onDelete.emit(accreditation)
  }

  handleOpenPreview(imageUrl) {
    let dialogOpts = new MatDialogConfig();
    dialogOpts.width = '65%';
    dialogOpts.maxHeight = '90vh';
    dialogOpts.data = {
      imageUrl: imageUrl
    }

    const dialog = this.dialog.open(ImagePreviewComponent, dialogOpts);
  }
}
