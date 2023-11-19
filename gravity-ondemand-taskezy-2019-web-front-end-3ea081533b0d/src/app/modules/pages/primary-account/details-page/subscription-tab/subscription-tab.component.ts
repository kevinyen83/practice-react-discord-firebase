import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

import { InvoicesModalComponent } from "./invoices-modal/invoices-modal.component";
import { UserProfileService } from "app/core/services/user-profile/user-profile.service";

@Component({
  selector: 'app-subscription-tab',
  templateUrl: './subscription-tab.component.html'
})
export class SubscriptionTabComponent implements OnInit {
  displayedColumns = ['type-users', 'count-used', 'remaining'];
  dataUsers = new MatTableDataSource<any>();

  @Output() goToPlan = new EventEmitter<any>();

  constructor(private dialog: MatDialog,
              private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    // this.userProfileService.getPlaneOfProfile().subscribe(res => {
    //   let planes = res;
    //   this.dataUsers = new MatTableDataSource<any>(planes);
    // });
  }

  goToHistory() {
    const dialogRef = this.dialog.open(InvoicesModalComponent, {
      width: '700px',
      data: [],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openBusinessPlan() {
    this.goToPlan.emit();
  }
}
