import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import {ImagePreviewComponent} from "../../image-preview/image-preview.component";

@Component({
  selector: 'app-resource-licences',
  templateUrl: './resource-licences.component.html'
})
export class ResourceLicencesComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['type', 'accreditation', 'licenceNumber', 'class', 'expiryDate', 'file', 'more'];

  @Input() licences;
  @Input() label;

  @Output() deleteAccreditations = new EventEmitter<any>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.licences);
  }

  handleRemove(accred) {
    this.deleteAccreditations.emit(accred);
    // this.accountService.deleteResourceFormDataByUUID()
  }

  handleOpenPreview(url) {
    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      width: '40%',
      data: {
        imageUrl: url
      }
    });
  }

}
