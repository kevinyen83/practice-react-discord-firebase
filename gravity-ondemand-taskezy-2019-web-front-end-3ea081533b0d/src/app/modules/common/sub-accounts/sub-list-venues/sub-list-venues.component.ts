import { Component, OnInit, Output, EventEmitter, NgZone, ViewChild } from '@angular/core';

import { catchError, takeUntil } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

// import { AddressesService } from "app/core/services/addresses/addresses.service";
import { AccountService } from 'app/core/services/account/account.service';
import { GoogleMap } from '@angular/google-maps';
import {HeaderButtonService} from "../../../../core/services/header-with-button/header-with-button.service";

@Component({
  selector: 'app-sub-list-venues',
  templateUrl: './sub-list-venues.component.html'
})
export class SubListVenuesUserComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) googleMap: GoogleMap;

  venues = [];
  autoComplete;
  unsubscribeAll = new Subject<any>();
  currentLatLng = {
    type: 'Point',
    coordinates: [
      0,
      0
    ]
  };
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
  mapBounds = new google.maps.LatLngBounds();
  markerOptions = { draggable: true };
  mapMarkers = [];

  @Output() newVenue = new EventEmitter<any>();
  @Output() selectVenue = new EventEmitter<any>();

  constructor(private accountService: AccountService,
              private headerButtonService: HeaderButtonService) {}

  ngOnInit(): void {

    this.accountService.selectedAccount
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.venues = res?.venues;
        const markers = [];
        // if(this.venues.length > 0) {

        // this.mapOptions.center.lat = this.venues[0].address.geo_location.coordinates[1];
        // this.mapOptions.center.lng = this.venues[0].address.geo_location.coordinates[0];
        this.venues.map((venue) => {
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
        // }
        // this.loadMap();
        this.mapMarkers = markers;
        this.loadMap();
      });
  }

  openAddVenue() {
    this.newVenue.emit();
  }

  editVenue(venue) {
    this.selectVenue.emit(venue?.uuid);
  }

  // getMap(address) {
  //   this.addressesService
  //     .getCurrentAddress(address)
  //     .pipe(takeUntil(this.unsubscribeAll),
  //       catchError((err) => {
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe((data) => {
  //       this.mapVisible = true;
  //       this.mapOptions.center.lat = data.results[0].geometry.location.lat;
  //       this.mapOptions.center.lng = data.results[0].geometry.location.lng;
  //       this.loadMap();
  //     });
  // }
  onMapReady(e) {
    this.googleMap = e;
    this.loadMap();
  }
  loadMap() {
    if (this.googleMap) {
      this.googleMap.fitBounds(this.mapBounds);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
