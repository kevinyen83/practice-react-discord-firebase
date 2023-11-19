import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";

import { AccountService } from "../../../../../../core/services/account/account.service";
import { AddAccreditationModalComponent } from "../add-accreditation-modal/add-accreditation-modal.component";

@Component({
  selector: 'app-table-licence',
  templateUrl: './table-licence.component.html'
})
export class TableLicenceComponent implements OnInit {
  displayedColumns = ['type', 'name and description', 'timing of requirements'];
  dataSourceLicence: MatTableDataSource<any>;
  currentAccount: any;
  list = [];

  @Input() venue;
  @Input() accreditation;
  @Input() accountType;
  @Input() venueClient;

  @Output() updateAccreditation = new EventEmitter<any>();

  constructor(private accountService: AccountService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentAccount = this.accountService.currentAccount.getValue();
    this.list = [this.accreditation];
    this.dataSourceLicence = new MatTableDataSource<any>(this.list);
  }

  edit(el) {
    const dialogRef = this.dialog.open(AddAccreditationModalComponent, {
      width: '700px',
      data: {
        status: 'edit',
        currentAccreditation: el,
        list: this.venue?.accreditation_requirements || []
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (this.accountType === 'venue') {
        this.accountService.updateVenueAccreditation(this.currentAccount?.uuid, this.venue.uuid, res).pipe(
          tap(res => {
            this.updateView(res, el);
          })
        ).subscribe();
      } else if (this.accountType === 'clientVenue') {
        this.accountService.updateVenueClientAccreditation(this.currentAccount.uuid, this.venueClient.uuid, this.venue.uuid, res).pipe(
          tap(res => {
            this.updateView(res, el);
          })
        ).subscribe();
      }
    });
  }

  updateView(res, el) {
    let index = this.list.findIndex(l => l.name === el.name);
    this.list.splice(index, 1, res);
    let inx = this.venue.accreditation_requirements.findIndex(l => l.name === el.name);
    this.updateAccreditation.emit({index: inx, accreditation: res});
    this.dataSourceLicence = new MatTableDataSource<any>(this.list);
  }

  remove(el) {
    this.accountService.deleteVenueAccreditation(this.venueClient?.uuid, this.venue?.uuid, el?.template_uuid).pipe(
      tap((res: any) => {
        this.list = this.list.filter(l => l.template_uuid !== el.template_uuid);
        this.dataSourceLicence = new MatTableDataSource<any>(this.list);
      })
    ).subscribe();
  }

}
