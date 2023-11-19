import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation,ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl } from '@angular/forms';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Subject, takeUntil } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { AccountService } from '../../../../core/services/account/account.service';
import { GoogleMap } from '@angular/google-maps';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";

export enum venueStatus {
  VENUE_DETAILS_TAB = 'VENUE_DETAILS_TAB',
  VENUE_MANAGERS_TAB = 'VENUE_MANAGERS_TAB',
  VENUE_REPORTS_TAB = 'VENUE_REPORTS_TAB',
  VENUE_DOCUMENTS_TAB = 'VENUE_DOCUMENTS_TAB',
  VENUE_RESOURCE_TAB = 'VENUE_RESOURCE_TAB',
  VENUE_COMPLIANCE_TAB = 'VENUE_COMPLIANCE_TAB',
  VENUE_EQUIPMENT_REGISTER_TAB = 'VENUE_EQUIPMENT_REGISTER_TAB',
  VENUE_RESOURCE_REQUIREMENTS_TAB = 'VENUE_RESOURCE_REQUIREMENTS_TAB'
}

@Component({
  selector: 'app-list-venues',
  templateUrl: './list-venues.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ListVenuesComponent implements OnInit, OnDestroy {
  addressLocation: ElementRef;
  // @ViewChild('addressLocation', { static: true }) set address(content: ElementRef) {
  //   if (content) {
  //     this.addressLocation = content;
  //   }
  // }
  @ViewChild('matDrawerVenue') matDrawerVenue;
  @ViewChild(GoogleMap, { static: false }) googleMap: GoogleMap;

  status = 'primary_account';
  searchLocation: FormControl;
  currentTab = venueStatus.VENUE_DETAILS_TAB;
  currentAddress;
  autoComplete;
  activeIndex: number;
  searchVenues;
  venues: any[] = [];
  connectedVenues: any[] = [];
  // mapCenter: google.maps.LatLngLiteral = { lat: 0, lng÷: 0 };
  mapOptions: google.maps.MapOptions = {
    // center: { lat: 0, lng: 0 },
    // zoom: 12,
    mapTypeId: 'roadmap',
    clickableIcons: false,
    gestureHandling: 'cooperative',
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    disableDoubleClickZoom: false,
    draggable: false
  };
  allVenues = [];
  mapBounds = new google.maps.LatLngBounds();
  markerOptions = { draggable: true };
  currentAccount;
  unsubscribeAll = new Subject<any>();
  selectedValues = [];

  mapMarkers = [];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private headerButtonService: HeaderButtonService,
              private accountService: AccountService,
              private cdRef: ChangeDetectorRef) {
    this.searchLocation = new FormControl('');
  }

  ngOnInit(): void {
    this.searchVenues = this.formBuilder.control('');

    this.accountService.currentAccount
      .pipe(
        switchMap((res: any) => {
          this.currentAccount = res;
          if (this.currentAccount.uuid) {
            this.accountService.getConnectedVenues(this.currentAccount.uuid);
          }
          return this.accountService.connectedVenues;
        }),
        tap((res: any) => {
          // this.venues = res[0];

          // this.connectedVenues = res[1];
          this.venues = res.map((v) => {
            v.venue.client = v.client;
            return v.venue;
          });
          this.allVenues = [...this.venues];
          const markers = [];
          this.venues.map((venue) => {
            // let conVenue = this.connectedVenues.find((v) => v.venue.uuid === venue.uuid);
            // if (conVenue) {
            //   venue.client = conVenue.client;
            // }
            let pos: google.maps.LatLngLiteral = {
              lat: venue.address.geo_location.coordinates[1],
              lng: venue.address.geo_location.coordinates[0]
            };
            let opts: google.maps.MarkerOptions = {
              draggable: false
            };
            const ven = {
              position: pos,
              options: opts
            };
            this.mapBounds.extend(pos);
            markers.push(ven);
          });
          this.mapMarkers = markers;
          this.loadMap();
          this.cdRef.detectChanges()
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  onMapReady(e) {
    this.googleMap = e;
    this.loadMap();
  }
  // toVenueForm() {
  //   // this.isViewVenueForm = true;
  //   this.currentTab = venueStatus.VENUE_DETAILS_TAB;
  // }

  // closeAddVenueForm(event) {
  //   // this.isViewVenueForm = false;
  //   if (this.statusForm === "add") {
  //     this.venues = [...this.venues, event];
  //   }
  //   if (this.statusForm === "edit") {
  //     this.venues = this.venues.filter((v) => v.uuid !== event.uuid);
  //     this.venues = [...this.venues, event];
  //   }
  //   this.getMap(this.venues[0].address);
  // }

  // getMap(address) {
  //   this.addressesService
  //     .getCurrentAddress(address)
  //     .pipe(takeUntil(this.unsubscribeAll),
  //     catchError((err) => {
  //       return EMPTY;
  //     }))
  //     .subscribe((data) => {
  //       this.mapVisible = true;
  //       this.mapOptions.center.lat = data.results[0].geometry.location.lat;
  //       this.mapOptions.center.lng = data.results[0].geometry.location.lng;
  //       this.loadMap();
  //     });
  // }

  updateListVenues(event) {
    this.selectedValues = event.value;
    this.venues = this.applyFilter();
  }

  applyFilter() {
    if (!this.selectedValues || !this.selectedValues.length) {
      return this.allVenues;
    }

    return this.allVenues.filter((s) => this.selectedValues.includes(s.venue.name) || this.selectedValues.includes(s.venue.type) || this.selectedValues.includes(s.client.name));
  }

  loadMap() {
    if (this.googleMap) {
      this.googleMap.fitBounds(this.mapBounds);
    }
  }

  openVenue(venue) {
    this.router.navigate([`pages/list-venues/${venue.uuid}`]);
  }

  backToList() {
    this.matDrawerVenue.toggle();
    // this.isViewVenueForm = false;
    // this.currentVenue = null;
  }

  createNewVenue() {
    this.matDrawerVenue.toggle();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
