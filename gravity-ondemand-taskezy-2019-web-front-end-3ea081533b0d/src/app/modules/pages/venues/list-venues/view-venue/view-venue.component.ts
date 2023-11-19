import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, switchMap, tap } from 'rxjs/operators';
import { combineLatest, EMPTY, Subject, takeUntil } from 'rxjs';

import { AccountService } from '../../../../../core/services/account/account.service';
import { HeaderButtonService } from "../../../../../core/services/header-with-button/header-with-button.service";
import { RosterService } from "../../../../../core/services/roster/roster.service";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
@Component({
  selector: 'app-view-venue',
  templateUrl: './view-venue.component.html'
})
export class ViewVenueComponent implements OnInit, OnDestroy {
  params;
  connectedVenues = [];
  currentVenue: any;
  currentAccount;
  currentVenueClient: any;
  venues = [];
  status;
  header: string;
  currentTab;
  isVenueTab

  accountType = 'venue';

  private unsubscribeAll = new Subject();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _fuseConfirmationService: FuseConfirmationService,
              public accountService: AccountService,
              private headerButtonService: HeaderButtonService) {
    // this.currentTab = this.headerButtonService.isVenueTab
  }

  ngOnInit(): void {

    this.headerButtonService.isVenueTab.subscribe((isVenueTab)=>{
      this.isVenueTab = isVenueTab
      // console.log("checked the value of isVenueTab, subscribed: ", this.isVenueTab)
    })

    this.route.params
      .pipe(
        tap((params) => {
          this.params = params;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();

    this.accountService.currentAccount
      .pipe(
        switchMap((res) => {
          this.currentAccount = res;
          if (this.currentAccount.uuid) {
            this.accountService.getConnectedVenues(this.currentAccount.uuid);
          }
          return this.accountService.connectedVenues;
        }),
        tap((res: any) => {
          // this.venues = res;
          this.venues = res.map((v) => {
            v.venue.client = v.client;
            return v.venue;
          });
          if (this.currentAccount?.uuid) {
            if (this.venues.length > 0 && this.params['id']) {
              this.status = 'edit';
              const v = this.venues.find((v) => v.uuid === this.params['id']);
              this.currentVenue = v || {};
              this.currentVenueClient = [this.currentAccount, ...this.currentAccount.clients].find((c) => c.uuid === v.client.uuid) || {};
              // console.log(this.currentVenueClient, '=======')
              this.header = this.currentVenue?.name || 'Venue';
              if (this.currentVenueClient.uuid != this.currentAccount?.uuid) {
                this.accountType = 'clientVenue';
              }
            }
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

  // updatedVenues(event) {
  //   let newArr = this.venues.filter((v) => v.uuid !== event.uuid);
  //   this.accountService.connectedVenues = newArr;
  // }

  showNotification(event) {
    this._fuseConfirmationService.open({
      title: 'Error',
        message: `${event}`,
      icon: {
      show: false
    },
      actions: {
        confirm: {
          show: true,
            label: 'Ok',
            color: 'primary'
        },
        cancel: {
          show: false,
            label: 'Cancel'
        }
      }
    })
  }

  closeVenue() {
    this.router.navigate(['/pages/list-venues']);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
