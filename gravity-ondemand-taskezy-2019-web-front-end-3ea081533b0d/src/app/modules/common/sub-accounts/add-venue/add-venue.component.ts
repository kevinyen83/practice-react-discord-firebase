import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
  OnDestroy,
  HostListener
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { debounceTime, of, Subject, switchMap, take } from 'rxjs';

import { AccountService } from 'app/core/services/account/account.service';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
import { ComplianceService } from 'app/core/services/compliance/compliance.service';

@Component({
  selector: 'app-add-venue',
  templateUrl: './add-venue.component.html'
})
export class AddVenueComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('address') address: ElementRef;

  @Input() header;
  // @Input() status;
  @Input() accountType;
  @Input() statusForm;
  @Input() currentVenue;
  @Input() isCreatingVenueFromClient: boolean = true;
  @Input() set currentAccount(value) {
    if (value) {
      this._currentAccount = value;
      this.buildForm();
      this.setValues();
    }
  }
  @Output() closeAddVenueForm = new EventEmitter<any>();

  _currentAccount;
  selectedAccount: any;
  station: FormControl;
  venueForm: FormGroup;
  isNewStationField = false;
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    center: { lat: 0, lng: 0 },
    zoom: 18,
    scrollwheel: false,
    disableDoubleClickZoom: false
  };
  // reference: string;
  markerOptions = { draggable: false };
  mapVisible: boolean = false;
  viewLicence: boolean = false;
  autoComplete;
  clients = [];
  viewSpinner = false;
  currentAddress;
  licenceDetail = null;
  unsubscribeAll = new Subject<any>();

  status = 'create';

  stationList = [
    'Main Entrance',
    'Side Entrance',
    'Rear Entrance',
    'Main Bar',
    'Terrace Bar',
    'Pool Bar',
    'Garden Bar',
    'Dining Area',
    'Gaming Area',
    'Outdoor Area',
    'Operations Room',
    'Front Door'
  ];

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  constructor(private ngZone: NgZone,
              private router: Router,
              public accountService: AccountService,
              private headerButtonService: HeaderButtonService,
              private complianceService: ComplianceService) {
    this.station = new FormControl('');
  }

  ngOnInit(): void {
    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'cancelVenue') {
        this.backToVenues();
      }
      else if (res === 'cancelAddingVenue') {
        this.cancelVenue()
      }
      else if (res === 'saveAddingVenue') {
        this.save()
      }
    });
    this.headerButtonService.isSaved.subscribe(res => {
      if (res === 'saveVenue') {
        this.save();
      }
    });
    this.accountService.setPauseRefresh(true);
  }

  backToVenues() {
    this.cancelVenue();
  }

  ngAfterViewInit() {
    this.getMap();
  }

  setValues() {
    if (this._currentAccount?.clients) {
      this.clients = [
        this._currentAccount,
        ...this._currentAccount?.clients
      ];
    }
    if (this.accountType === 'client') {
      this.selectedAccount = this.accountService.selectedAccount.getValue();
      this.venueForm.get('client').patchValue(this.selectedAccount);
      this.venueForm.get('client').disable();
    } else {
      this.selectedAccount = this._currentAccount;
      this.venueForm.get('client').setValue(this._currentAccount);
      if(!this.accountService.currentAccountIsSubscriber) {
        this.venueForm.get('client').disable();
      }
    }
  }

  handleLicenceChange(evt) {
    console.log("evt ---", evt.target.value)
    if(evt.target.value !== "") {
      this.complianceService.checkNSWLicence(evt.target.value).pipe(
        tap(res => {
          console.log("res -----", res)
          this.licenceDetail = res;
        }),
        catchError((error: any) => {
          console.log("error ---", error)
          this.venueForm.get('licenceNumber').setErrors({licenceError: "error"})
          this.licenceDetail = null
          return of(error);
        })
      ).subscribe()
    } else {
      this.venueForm.get('licenceNumber').setErrors(null)
      this.licenceDetail = null;
    }

  }

  getMap() {
    this.autoComplete = new google.maps.places.Autocomplete(this.address.nativeElement, {
      types: ['address']
    });
    this.autoComplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
        if (place && place['formatted_address']) {
          this.currentAddress = place;
          // this.reference = place["reference"];
          this.mapVisible = true;
          this.venueForm.get('address').patchValue(this.currentAddress.formatted_address);
          this.mapOptions.center.lat = this.currentAddress.geometry.location.lat();
          this.mapOptions.center.lng = this.currentAddress.geometry.location.lng();
          this.loadMap();
        }
      });
    });
  }

  changeType(e) {
    if (e.value === 'Private') {
      this.viewLicence = false;
      this.venueForm.get('licenceNumber').clearValidators();
      this.venueForm.get('licenceNumber').updateValueAndValidity();
    } else if (e.value === 'Public') {
      this.viewLicence = true;
      // this.venueForm.get('licenceNumber').setValidators(Validators.required);
      this.venueForm.get('licenceNumber').updateValueAndValidity();
    }
  }

  addNewStation() {
    this.isNewStationField = true;
  }

  saveNewStation() {
    let value = this.station.value;
    if (value) {
      this.stationList.push(value);
    }
    this.isNewStationField = false;
    this.station.reset();
  }

  loadMap() {
    this.mapCenter = {
      lat: +this.mapOptions.center.lat,
      lng: +this.mapOptions.center.lng
    };
  }

  buildForm() {
    this.venueForm = new FormGroup({
      client: new FormControl({}, Validators.required),
      venueName: new FormControl('', Validators.required),
      typeOfVenue: new FormControl('Private', Validators.required),
      stations: new FormControl([]),
      address: new FormControl('', Validators.required),
      licenceNumber: new FormControl(''),
      signOnDistance: new FormControl(100, Validators.pattern('[0-9]*'))
    });
    this.headerButtonService.venueForm = this.venueForm;
  }

  // buildEditForm() {
  //   this.currentAddress = this.currentVenue.address;
  //   const stations = this.currentVenue.stations.map((val) => val.name);
  //   this.venueForm.patchValue({
  //     client: this.selectedAccount,
  //     venueName: this.currentVenue.name,
  //     typeOfVenue: this.currentVenue.type,
  //     stations: stations,
  //     address: this.currentAddress.street_location,
  //     licenceNumber: this.currentVenue.licence,
  //     licenceName: this.currentVenue.licenceName,
  //   });
  //
  //   if (this.currentVenue.type === "Private") {
  //     this.viewLicence = false;
  //     this.venueForm.get('licenceNumber').removeValidators(Validators.required);
  //     this.venueForm.get('licenceName').removeValidators(Validators.required);
  //   } else if (this.currentVenue.type === "Public") {
  //     this.viewLicence = true;
  //     this.venueForm.get('licenceNumber').setValidators(Validators.required);
  //     this.venueForm.get('licenceName').setValidators(Validators.required);
  //   }
  //   this.mapVisible = true;
  //   this.mapOptions.center.lat = this.currentAddress.geo_location.coordinates[1];
  //   this.mapOptions.center.lng = this.currentAddress.geo_location.coordinates[0];
  //   this.loadMap();
  // }

  save() {

      this.venueForm.markAllAsTouched();
      if (this.venueForm.valid) {
        if (!this.viewSpinner) {this.viewSpinner = true;}
        const client = this.venueForm.get('client').value;
        const venue = {
          type: this.venueForm.get('typeOfVenue').value,
          name: this.venueForm.get('venueName').value,
          stations: this.venueForm.get('stations').value?.map((val) => ({ name: val })),
          address: {
            geo_location: {
              coordinates: [
                this.currentAddress?.geometry?.location.lng(),
                this.currentAddress?.geometry?.location.lat()
              ],
              type: 'Point'
            },
            'google-call': this.currentAddress?.url,
            'google-place-id': this.currentAddress?.place_id,
            street_location: this.currentAddress?.formatted_address
          },
          sign_on_distance: Number(this.venueForm.get('signOnDistance').value)
        };

        venue['licence_number'] = this.venueForm.get('licenceNumber').value;

        if (this.status == 'create') {
          if (this.accountType == 'client' || client?.uuid !== this._currentAccount?.uuid) {
            // As a primary account we can add a venue to one of our clients from the venues menu list.
            // as much we need to check if the clientId selected in client input above matches our current primary account
            // if it doesn't, then we are adding it to a client account, not the primary.
            this.accountService
              .addClientVenues(this._currentAccount?.uuid, client?.uuid, venue)
              .pipe(
                debounceTime(200),
                switchMap((res) => {
                  this.viewSpinner = false;
                  this.accountService.getConnectedVenues(this._currentAccount?.uuid);
                  return this.accountService.setCurrentAccount(this._currentAccount?.uuid);
                }),
                tap((res) => {
                  this.cancelVenue();
                })
                // takeUntil(this.unsubscribeAll)
              )
              .subscribe();
          } else if (this.accountType == 'primaryAccount') {
            this.accountService
              .addAccountVenues(this._currentAccount?.uuid, venue)
              .pipe(
                debounceTime(200),
                switchMap((res: any) => {
                  this.viewSpinner = false;
                  this.accountService.getConnectedVenues(this._currentAccount.uuid);
                  return this.accountService.setCurrentAccount(this._currentAccount.uuid);
                }),
                tap((res) => {
                  this.cancelVenue();
                })
                // takeUntil(this.unsubscribeAll)
              )
              .subscribe();
          }
        }
        // else if(this.status == "edit") {
        //
        //   const mergedVenue = Object.assign(this.currentVenue, venue);
        //   if(this.accountType == "client" || client.uuid !== this.currentAccount.uuid) {
        //     this.accountService.updateClientVenueByUUID(this.currentAccount.uuid, client.uuid, this.currentVenue.uuid, mergedVenue)
        //     .pipe(
        //       tap((res) => {
        //         this.cancelVenue();
        //         this.viewSpinner = false;
        //         this.accountService.getConnectedVenues(this.currentAccount.uuid);
        //         this.accountService.setCurrentAccount(this.currentAccount.uuid).subscribe();
        //       })
        //     )
        //     .subscribe()
        //   } else if(this.accountType == "primaryAccount") {
        //     this.accountService.updateAccountVenueByUUID(this.currentAccount.uuid, this.currentVenue.uuid, mergedVenue)
        //     .pipe(
        //       tap((res) => {
        //         this.cancelVenue();
        //         this.viewSpinner = false;
        //         this.accountService.getConnectedVenues(this.currentAccount.uuid);
        //         this.accountService.setCurrentAccount(this.currentAccount.uuid).subscribe();
        //       })
        //     )
        //     .subscribe()
        //   }
        // }
      }

      //save it to the selected venue.client uuid
      //if venue.client.uuid == currentaccount.uuid save to currentaccount instead of sub account

  }

  cancelVenue() {
    this.venueForm.reset();
    this.mapCenter = { lat: 0, lng: 0 };
    this.mapVisible = false;
    this.licenceDetail = null;
    this.closeAddVenueForm.emit();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    this.accountService.setPauseRefresh(false);
  }
}
