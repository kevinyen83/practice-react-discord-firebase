import { Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FuseAlertType } from '@fuse/components/alert';

import { fuseAnimations } from '@fuse/animations';

import { AccountService } from 'app/core/services/account/account.service';
import { venueStatus } from '../list-venues.component';

@Component({
  selector: 'app-create-venue',
  templateUrl: './create-venue.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreateVenueComponent implements OnInit {
  @Output() backToList = new EventEmitter<any>();
  headerH1 = 'Venues';
  activeIndex = 0;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  header = 'Add Venue';
  tabs = ['Venue details', 'Venue manager', 'Reports', 'Engagement Details & Documents', 'Resource', 'Compliance and Operations', 'Equipment register', 'Resource Requirements and Rates'];
  showAlert: boolean;
  currentAccount;
  status;
  connectedVenues = [];
  currentTab = venueStatus.VENUE_DETAILS_TAB;
  currentVenue: any;
  currentVenueClient: any;
  viewAddVenue = false;
  viewEditVenue = false;

  unsubscribeAll = new Subject<any>();

  constructor(private router: Router, public accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentAccount
      .pipe(
        switchMap((res: any) => {
          this.currentAccount = res;
          if (this.currentAccount?.uuid) {
            this.accountService.getConnectedVenues(this.currentAccount?.uuid);
          }
          return this.accountService.connectedVenues;
        }),
        tap((res: any) => {
          this.connectedVenues = res;
          if (this.currentAccount?.uuid) {
            this.status = 'add';
            this.viewAddVenue = true;
          }
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }


  backListVenues() {
    this.backToList.emit();
    // this.closeVenueForm();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
