import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { AddAccreditationModalComponent } from './add-accreditation-modal/add-accreditation-modal.component';
import { AddRateWindowComponent } from '../../../add-rate-window/add-rate-window.component';
import { AccountService } from '../../../../../core/services/account/account.service';

@Component({
  selector: 'app-list-accordions',
  templateUrl: './list-accordions.component.html'
})

export class ListAccordionsComponent implements OnInit {
  indexExpanded: number;

  @Input() venue;
  @Input() venueClient;
  @Input() currentAccount;
  @Input() accountType;
  list = [];

  private unsubscribeAll = new Subject();

  constructor(private dialog: MatDialog, private accountService: AccountService) {}

  ngOnInit(): void {
    if (this.venue && !this.venue?.resource_rates) {
      this.venue.resource_rates = [];
    }
    if (this.venue && !this.venue?.accreditation_requirements) {
      this.venue.accreditation_requirements = [];
    }
    console.log(this.accountType);
  }

  addRate() {
    let dialog = this.dialog.open(AddRateWindowComponent, {
      width: '900px',
      data: {
        venue: this.venue,
        venueClient: this.venueClient,
        currentAccount: this.currentAccount
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        // this.listRoles.push(result);
        // added via accountService, then refresh the venue;
      }
    });
  }

  editRate(rate) {
    let dialog = this.dialog.open(AddRateWindowComponent, {
      width: '900px',
      data: {
        currentRate: rate,
        venue: this.venue,
        venueClient: this.venueClient,
        currentAccount: this.currentAccount
      }
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {

      }
    });
  }

  setStep(index) {
    this.indexExpanded = index;
  }

  closePanel(event, i) {
    this.indexExpanded = i == this.indexExpanded ? -1 : i;
  }

  deleteRole(index) {
    // this.listRoles = this.listRoles.filter((role, i) => i !== index);
    // delete via accountService, then refresh the venue;
  }

  addAccreditation() {
    const dialogRef = this.dialog.open(AddAccreditationModalComponent, {
      width: '700px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.accountType === 'clientVenue') {
          this.accountService
            .addClientVenueAccreditation(this.currentAccount.uuid, this.venueClient?.uuid, this.venue.uuid, result)
            .pipe(
              tap((res) => {
                this.venue.accreditation_requirements.push(result);
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === 'venue') {
          this.accountService
            .addVenueAccreditation(this.currentAccount.uuid, this.venue.uuid, result)
            .pipe(
              tap((res) => {
                this.venue.accreditation_requirements.push(result);
              })
            )
            .subscribe();
        }
      }
    });
  }
  editAccreditation(index, accred) {
    const dialogRef = this.dialog.open(AddAccreditationModalComponent, {
      width: '700px',
      data: accred
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.accountType === 'clientVenue') {
          this.accountService.deleteVenueAccreditation(this.venueClient?.uuid, this.venue?.uuid, this.venue?.accreditation_requirements[index]?.template_uuid).subscribe();
          this.accountService
            .addClientVenueAccreditation(this.currentAccount.uuid, this.venueClient?.uuid, this.venue.uuid, result)
            .pipe(
              tap((res) => {
                this.venue.accreditation_requirements.push(result);
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe();
        } else if (this.accountType === 'venue') {
          this.accountService.deleteVenueAccreditation(this.venueClient?.uuid, this.venue?.uuid, this.venue?.accreditation_requirements[index]?.template_uuid).subscribe();
          this.accountService
            .addVenueAccreditation(this.currentAccount.uuid, this.venue.uuid, result)
            .pipe(
              tap((res) => {
                this.venue.accreditation_requirements.push(result);
              })
            )
            .subscribe();
        }
      }
    });
  }

  updateView(res, el) {
    let index = this.list.findIndex(l => l.name === el.name);
    this.list.splice(index, 1, res);
    let inx = this.venue.accreditation_requirements.findIndex(l => l.name === el.name);
    // this.updateAccreditation.emit({index: inx, accreditation: res});
    // this.dataSourceLicence = new MatTableDataSource<any>(this.list);
  }

  deleteAccreditation(index) {
   
    this.accountService.deleteVenueAccreditation(this.venueClient?.uuid, this.venue?.uuid, this.venue?.accreditation_requirements[index]?.template_uuid).subscribe(); 
  }

  updateAccreditation(event) {
    event.accreditation.expanded = true;
    this.venue.accreditation_requirements.splice(event.index, 1, event.accreditation);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
