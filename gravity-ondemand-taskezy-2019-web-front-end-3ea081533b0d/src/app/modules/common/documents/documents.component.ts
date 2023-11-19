import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef, ViewChild, AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import * as moment from 'moment';
import { catchError, retry, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from "@angular/material/paginator";
import { forkJoin, of, Subject } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AccountService } from '../../../core/services/account/account.service';
import { EditDocumentComponent } from '../sub-accounts/edit-document/edit-document.component';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import { MatSort } from "@angular/material/sort";

enum Types {
  venue = 'venue',
  client = 'client',
  supplier = 'supplier',
  resource = 'resource',
  clientVenue = 'clientVenue'
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  animations: fuseAnimations
})
export class DocumentsComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'name',
    'tag',
    'type',
    'dateAdded',
    'dateModified',
    'activeLink'
  ];
  dataSource = new MatTableDataSource<any>([]);
  filtersDocumentsForm: FormGroup;
  fileUrl;
  tags = [];
  types = [];
  _selectedAccount = this.accountService.selectedAccount.getValue();
  _venue = this.accountService.selectedVenue.getValue();
  accountType: string = 'none';
  unsubscribeAll = new Subject<any>();
  metaCache = {}
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() documents;
  @Input() header;
  @Input() set type(val) {
    if (val) {
      this.accountType = val;
    }
  };
  @Input() currentAccount;
  @Input() set selectedAccount(val) {
    if (val) {
      this._selectedAccount = val;
    }
  };
  @Input() set venue(val) {
    if (val) {
      this._venue = val;
    }
  };

  @Output() saveDocuments = new EventEmitter<any>();

  constructor(private accountService: AccountService,
              private sanitizer: DomSanitizer,
              private documentsService: DocumentsService,
              private dialog: MatDialog,
              private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit() {
    if (this.accountType && this.accountType === Types.client || this.accountType === Types.supplier || this.accountType === Types.resource) {
      this.documents = this._selectedAccount?.documents;
      this.buildMetaInfor(this._selectedAccount?.documents)
    } else if (this.accountType && this.accountType === Types.venue || Types.clientVenue) {
      this.documents = this._venue?.documents;
      this.buildMetaInfor(this._venue?.documents);
    }
  }

  buildMetaInfor(documents) {
    documents?.forEach(doc => {
      if (doc.name) {
        if (!this.types.includes(this.metaCache[doc.name]?.content_type)) {
          this.types.push(this.metaCache[doc.name]?.content_type);
        }
        if (!this.tags.includes(doc.tag)) {
          this.tags.push(doc.tag);
        }
      }
    });
    const filteredDocs = (documents || []).filter(item => !this.metaCache[item.name]);
    if((filteredDocs || []).length > 0) {
      forkJoin((filteredDocs || []).map(item => this.documentsService.getMetaData(item.name).pipe(catchError(error => of('Error'))))).subscribe((res: any) => {
        (res || []).forEach(resItem => {
          this.metaCache[resItem.filename] = resItem.metadata
        })
      });
      this.dataSource = new MatTableDataSource<any>(documents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    } else {
      this.dataSource = new MatTableDataSource<any>(documents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  buildForm() {
    this.filtersDocumentsForm = new FormGroup({
      searchDocuments: new FormControl(''),
      tag: new FormControl(''),
      venue: new FormControl('')
    });
  }

  getSubAccountUUID() {
    switch(this.accountType) {
      case Types.resource:
        return this._selectedAccount?.user_id;
      case Types.clientVenue:
        return this._selectedAccount?.uuid;
      case Types.venue:
        return this._venue?.uuid;
      case Types.client:
        return this._selectedAccount?.uuid;
      case Types.supplier:
        return this._selectedAccount?.uuid;
    }
  }

  saveFiles(event) {
    const {files, res} = event;
    this.saveDocuments.emit(files[0]);
    let document = {
      date_added: moment(),
      date_modified: files[0]['lastModifiedDate'],
      description: "",
      name: res.filename,
      private: true,
      tag: this.accountType
    };
    if (this.accountType === Types.resource) {
      this.accountService
        .addResourceDocuments(this.currentAccount?.uuid, this._selectedAccount?.user_id, document)
        .pipe(
          tap((res) => {
            this.documents = [
              ...(this.documents || []),
              res
            ];
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.clientVenue) {
      this.accountService
        .addClientVenueDocument(this.currentAccount?.uuid, this._selectedAccount?.uuid, this._venue?.uuid, document)
        .pipe(
          tap((res) => {
            this.documents = [
              ...(this.documents || []),
              res
            ];
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.venue) {
      this.accountService
        .addAccountVenueDocuments(this.currentAccount?.uuid, this._venue?.uuid, document)
        .pipe(
          tap((res) => {
            this.documents = [
              ...(this.documents || []),
              res
            ];
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.client) {
      this.accountService
        .addClientDocuments(this.currentAccount?.uuid, this._selectedAccount?.uuid, document)
        .pipe(
          tap((res) => {
            this.documents = [
              ...(this.documents || []),
              res
            ];
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.supplier) {
      this.accountService
        .addSupplierDocuments(this.currentAccount?.uuid, this._selectedAccount?.uuid, document)
        .pipe(
          tap((res) => {
            this.documents = [
              ...(this.documents || []),
              res
            ];
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  downloadFile(file) {
    this.documentsService.getFilesDownload(file.name).subscribe(res => {
      let blob = new Blob([res], { type: this.metaCache[file.name]?.content_type});
        let url = window.URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        if (this.metaCache[file.name]?.original_name)
            downloadLink.setAttribute('download', this.metaCache[file.name]?.original_name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
    })
  }

  editFile(file) {
    const dialogRef = this.dialog.open(EditDocumentComponent, {
      width: '800px',
      data: {
        file: file,
        accountType: this.accountType
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (this.accountType === Types.clientVenue) {
          this.accountService
            .updateClientVenueDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.uuid, this._venue.uuid, file?.uuid, {...file, ...res[0]})
            .pipe(
              tap((res) => {
                let i = this.documents.findIndex((d) => d.uuid === res['uuid']);
                this.documents.splice(i, 1, res);
                this.buildMetaInfor(this.documents);
              }),
              takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === Types.resource) {
          this.accountService
            .updateResourceDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.user_id, file?.uuid, {...file, ...res[0]})
            .pipe(
              tap((res) => {
                let i = this.documents.findIndex((d) => d.uuid === res['uuid']);
                this.documents.splice(i, 1, res);
                this.buildMetaInfor(this.documents);
              }),
              takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === Types.venue) {
          this.accountService
            .updateAccountVenueDocumentByUUID(this.currentAccount?.uuid, this._venue?.uuid, {...file, ...res[0]})
            .pipe(
              tap((res) => {
                let i = this.documents.findIndex((d) => d.uuid === res['uuid']);
                this.documents.splice(i, 1, res);
                this.buildMetaInfor(this.documents);
              }),
              takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === Types.client) {
          this.accountService
            .updateClientDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.uuid, file?.uuid, {...file, ...res[0]})
            .pipe(
              tap((res) => {
                let i = this.documents.findIndex((d) => d.uuid === res['uuid']);
                this.documents.splice(i, 1, res);
                this.buildMetaInfor(this.documents);
              }),
              takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === Types.supplier) {
          this.accountService
            .updateSupplierDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.uuid, file?.uuid, {...file, ...res[0]})
            .pipe(
              tap((res) => {
                let i = this.documents.findIndex((d) => d.uuid === res['uuid']);
                this.documents.splice(i, 1, res);
                this.buildMetaInfor(this.documents);
              }),
              takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        }
      }
    });
  }

  deleteFile(file) {
    if (this.accountType === Types.clientVenue) {
      this.accountService
        .deleteClientVenueDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.uuid, this._venue?.uuid, file?.uuid)
        .pipe(
          tap((res) => {
            this.documents = this.documents.filter(doc => doc.uuid !== file?.uuid);
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.resource) {
      this.accountService
        .deleteResourceDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.user_id, file?.uuid)
        .pipe(
          tap((res) => {
            this.documents = this.documents.filter(doc => doc.uuid !== file?.uuid);
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.venue) {
      this.accountService
        .deleteAccountVenueDocumentByUUID(this.currentAccount?.uuid, this._venue?.uuid, file?.uuid)
        .pipe(
          tap((res) => {
            this.documents = this.documents.filter(doc => doc.uuid !== file?.uuid);
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.client) {
      this.accountService
        .deleteClientDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.uuid, file?.uuid)
        .pipe(
          retry(0),
          tap((res) => {
            this.documents = this.documents.filter(doc => doc.uuid !== file?.uuid);
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === Types.supplier) {
      this.accountService
        .deleteSupplierDocumentByUUID(this.currentAccount?.uuid, this._selectedAccount?.uuid, file?.uuid)
        .pipe(
          tap((res) => {
            this.documents = this.documents.filter(doc => doc.uuid !== file?.uuid);
            this.buildMetaInfor(this.documents);
          }),
          takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  sortData(event) {}


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
