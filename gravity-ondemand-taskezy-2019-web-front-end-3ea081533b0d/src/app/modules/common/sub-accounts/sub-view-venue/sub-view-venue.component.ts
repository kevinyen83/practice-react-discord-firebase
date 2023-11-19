import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import { catchError, takeUntil } from 'rxjs/operators';
import { EMPTY, Subject, tap } from 'rxjs';

import { AccountService } from 'app/core/services/account/account.service';
import { venueStatus } from '../../../pages/venues/list-venues/list-venues.component';
import { VenuesService } from '../../../../core/services/venues/venues.service';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-sub-view-venue',
  templateUrl: './sub-view-venue.component.html'
})
export class SubViewVenueComponent implements OnInit, OnChanges {
  // zoom: number = 12;
  // mapVisible: boolean = false;
  currentTab = venueStatus.VENUE_DETAILS_TAB;
  @Output() currentTabUpdated = new EventEmitter<string>();
  tabs = [
    { name: 'Venue details' },
    // { name: 'Venue manager' },
    // { name: 'Reports' },
    // { name: 'Engagement Details & Documents' },
    // { name: 'Resource Details' },
    // { name: 'Shift Roles' }
  ];
  //'Equipment register',

  unsubscribeAll = new Subject<any>();
  // currentLatLng = {
  //   type: "Point",
  //   coordinates: [0, 0],
  // };
  // mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  // mapOptions: google.maps.MapOptions = {
  //   center: { lat: 0, lng: 0 },
  //   zoom: 12,
  //   mapTypeId: 'roadmap',
  //   clickableIcons: false,
  //   gestureHandling: 'cooperative',
  //   mapTypeControl: false,
  //   zoomControl: false,
  //   streetViewControl: false,
  //   disableDoubleClickZoom: false,
  // };
  // markerOptions = { draggable: false };

  currentAccount;
  selectedAccount;

  @Input() accountType;
  @Input() venue;
  @Input() venueClient;
  @Input() showSidemenu;
  @Output() updatedVenues = new EventEmitter<any>();
  @Output() pressBack = new EventEmitter<any>();

  constructor(private venuesService: VenuesService, public accountService: AccountService,
    private headerButtonService: HeaderButtonService) {
      this.tabs = [
        { name: 'Venue details' },
        ...(accountService.currentAccountIsSubscriber ? [{ name: 'Venue manager' }] : []),
        ...(accountService.currentAccountIsSubscriber ? [{ name: 'Engagement Details & Documents' }] : []),
        ...(accountService.currentAccountIsSubscriber ? [{ name: 'Shift Roles' }] : [])
      ];
    }

  ngOnInit(): void {
    console.log("this is the venueClient: ", this.venueClient)
    this.headerButtonService.isEditing.subscribe(res => {
      console.log("lets check the res: ",res);
    });


    // this.headerButtonService.isVenueTab.next("VENUE_DETAILS_TAB")
    this.accountService.currentAccount
      .pipe(
        tap((res) => {
          this.currentAccount = res;
          this.selectedAccount = this.accountService.selectedAccount.getValue();
          this.tabs = [
            { name: 'Venue details' },
            ...(this.accountService.currentAccountIsSubscriber ? [{ name: 'Venue manager' }] : []),
            ...(this.accountService.currentAccountIsSubscriber ? [{ name: 'Engagement Details & Documents' }] : []),
            ...(this.accountService.currentAccountIsSubscriber ? [{ name: 'Shift Roles' }] : [])
          ];
        }),
        catchError((err) => {
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
    this.venuesService.currentTab.subscribe((res) => {
      this.selectTabOfVenue(res);
    });
    // this.mapVisible = true;
    // this.mapOptions.center.lat = this.venue.address.geo_location.coordinates[1];
    // this.mapOptions.center.lng = this.venue.address.geo_location.coordinates[0];
    // this.loadMap();
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.log(changes); //we get the updated venueClient here,so need to go back one step to seeifwe can et the updated venue also sent
  }

  emitBack() {
    this.pressBack.emit();
  }

  selectTabOfVenue(tab) {
    switch (tab) {
      case 'Venue details':
        this.currentTab = venueStatus.VENUE_DETAILS_TAB;
        this.headerButtonService.isVenueTab.next(this.currentTab)
        break;
      case 'Venue manager':
        this.currentTab = venueStatus.VENUE_MANAGERS_TAB;
        this.headerButtonService.isVenueTab.next(this.currentTab)
        break;
      case 'Reports':
        this.currentTab = venueStatus.VENUE_REPORTS_TAB;
        this.headerButtonService.isVenueTab.next(this.currentTab)
        break;
      case 'Engagement Details & Documents':
        this.currentTab = venueStatus.VENUE_DOCUMENTS_TAB;
        this.headerButtonService.isVenueTab.next(this.currentTab)
        break;
      case 'Resource Details':
        this.currentTab = venueStatus.VENUE_RESOURCE_TAB;
        this.headerButtonService.isVenueTab.next(this.currentTab)
        break;
      case 'Shift Roles':
        this.currentTab = venueStatus.VENUE_RESOURCE_REQUIREMENTS_TAB;
        this.headerButtonService.isVenueTab.next(this.currentTab)
        break;
    }
  }

  deletedVenues(event) {
    this.updatedVenues.emit(event);
  }

  // loadMap() {
  //   this.mapCenter = {
  //     lat: +this.mapOptions.center.lat,
  //     lng: +this.mapOptions.center.lng,
  //   };
  // }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
