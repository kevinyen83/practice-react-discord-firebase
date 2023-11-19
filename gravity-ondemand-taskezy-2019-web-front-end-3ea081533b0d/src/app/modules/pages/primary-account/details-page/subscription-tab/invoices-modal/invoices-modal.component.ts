import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { MatDialogRef } from "@angular/material/dialog";

import { UserProfileService } from "app/core/services/user-profile/user-profile.service";

@Component({
  selector: 'app-invoices-modal',
  templateUrl: './invoices-modal.component.html'
})
export class InvoicesModalComponent implements OnInit {
  dataInvoices = new MatTableDataSource<any>();
  displayedColumns = ['product', 'reference', 'date', 'price', 'status', 'download'];

  constructor(private dialogRef: MatDialogRef<InvoicesModalComponent>,
              private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    // this.userProfileService.getInvoices().subscribe(res => {
    //   let invoices = res;
    //   this.dataInvoices = new MatTableDataSource<any>(invoices);
    // })
  }

  close() {
    this.dialogRef.close();
  }

}
