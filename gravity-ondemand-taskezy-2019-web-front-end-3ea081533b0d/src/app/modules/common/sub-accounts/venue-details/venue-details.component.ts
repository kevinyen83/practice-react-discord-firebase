import { Component, ElementRef, Input, NgZone, EventEmitter, OnInit, Output, ViewChild, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { EMPTY, of, Subject, switchMap, takeUntil } from 'rxjs';

import { AccountService } from '../../../../core/services/account/account.service';
import {HeaderButtonService} from "../../../../core/services/header-with-button/header-with-button.service";
import { ComplianceService } from 'app/core/services/compliance/compliance.service';

@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html'
})
export class VenueDetailsComponent implements OnInit, OnDestroy, OnChanges {
  fieldAddress: ElementRef;
  @ViewChild('address', { static: false }) set address(content: ElementRef) {
    if (content) {
      this.fieldAddress = content;
      this.getAddress();
    }
  }

  @Input() venue;
  @Input() venueClient;
  @Output() deletedVenue = new EventEmitter<any>();

  editVenueForm: FormGroup;
  viewMode = 'view';
  autoComplete;
  clients = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    center: { lat: 0, lng: 0 },
    zoom: 18,
    scrollwheel: false,
    disableDoubleClickZoom: false
  };
  licenceDetail;
  types = [
    'Public',
    'Private'
  ];
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
  currentAccount;
  currentAddress;
  viewLicence = false;
  station: FormControl;
  isNewStationField = false;

  private unsubscribeAll = new Subject();

  constructor(private accountService: AccountService,
              private ngZone: NgZone,
              private router: Router,
              private headerButtonService: HeaderButtonService,
              private complianceService: ComplianceService) {
    this.station = new FormControl('');
  }




  ngOnInit(): void {
    // this.headerButtonService.isEditing.subscribe(res => {
    //   if (res === 'venue' && this.viewMode== 'edit') {
    //     this.editDetails();
    //   } else if (res === 'venue' && this.editing) {
    //     this.cancelEdit();
    //   }
    // })
    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'edit') {
        this.toModeEdit();
      } else if (res === 'cancelVenue') {
        this.cancel();
      } else if (res === 'saveVenue') {
        this.save();
      } else if (res === 'deleteVenue') {
        this.delete();
      }
    });

    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildForm();
    this.accountService.currentAccount
      .pipe(
        catchError((err) => {
          return EMPTY;
        }),
        tap((res) => {
          this.currentAccount = res;
          if (this.currentAccount.uuid) {
            this.clients = [
              this.currentAccount,
              ...this.currentAccount.clients
            ];
            this.currentAddress = this.venue?.address || '';
          }
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
    this.handleLoadLicence()
  }

  handleLoadLicence() {
    if(this.venue?.licence_number) {
      this.complianceService.checkNSWLicence(this.venue?.licence_number).pipe(
        tap(res => {
          this.licenceDetail = res;
        }),
        catchError((error: any) => {
          this.licenceDetail = null
          return of(error);
        })
      ).subscribe()
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


  handleLicenceChange(evt) {
    if(evt.target.value !== "") {
      this.complianceService.checkNSWLicence(evt.target.value).pipe(
        tap(res => {
          this.licenceDetail = res;
        }),
        catchError((error: any) => {
          this.editVenueForm.get('licenceNumber').setErrors({licenceError: "error"})
          this.licenceDetail = null
          return of(error);
        })
      ).subscribe()
    } else {
      this.editVenueForm.get('licenceNumber').setErrors(null)
      this.licenceDetail = null;
    }

  }


  toModeEdit() {
    this.viewMode = 'edit';
    let stationsArray = [];
    this.venue?.stations.forEach((stat) => {
      stationsArray.push(stat.name);
      if (!this.stationList.includes(stat.name)) {
        this.stationList.push(stat.name);
      }
    });
    this.editVenueForm.patchValue({
      client: this.venueClient.uuid,
      address: this.venue?.address.street_location,
      type: this.venue?.type,
      station: stationsArray,
      venueName: this.venue?.name,
      signOnDistance: this.venue.sign_on_distance
    });
    this.changeType({ value: this.venue?.type });
    this.editVenueForm.get('client').disable();
    setTimeout(() => {
      this.getAddress();
      //this is in a set timeout as when the edit button is clicked, the elementRef doesnt exist until after it is drawn.
      //set timeout makes it run just after the edit button completes and the item is drawn.
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleLoadLicence();
  }

  buildForm() {
    this.editVenueForm = new FormGroup({
      client: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      type: new FormControl('Private', Validators.required),
      licenceNumber: new FormControl(''),
      venueName: new FormControl('', Validators.required),
      station: new FormControl([]),
      signOnDistance: new FormControl(100, Validators.pattern("^[0-9]*$"))
    });
  }

  getAddress() {
    this.autoComplete = new google.maps.places.Autocomplete(this.fieldAddress.nativeElement, {
      types: ['address']
    });

    this.autoComplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
        if (place && place['formatted_address']) {
          this.currentAddress = place;
          // this.reference = place["reference"];
          this.editVenueForm.get('address').patchValue(this.currentAddress.formatted_address);
          this.mapOptions.center.lat = this.currentAddress.geometry.location.lat();
          this.mapOptions.center.lng = this.currentAddress.geometry.location.lng();
        }
      });
    });
  }

  save() {
    const client = this.editVenueForm.get('client').value;
    if (this.editVenueForm.valid) {
      const venue: any = {
        type: this.editVenueForm.get('type').value,
        name: this.editVenueForm.get('venueName').value,
        stations: this.editVenueForm.get('station').value.map((val) => ({ name: val })),
        // licence_name: this.viewLicence ? this.editVenueForm.get('licenceName').value : '',
        licence_number: this.viewLicence ? this.editVenueForm.get('licenceNumber').value : '',
        sign_on_distance: +this.editVenueForm.get('signOnDistance').value
      };
      if (this.currentAddress.geometry) {
        venue.address = {
          geo_location: {
            coordinates: [
              this.currentAddress.geometry.location.lng(),
              this.currentAddress.geometry.location.lat()
            ],
            type: 'Point'
          },
          'google-call': this.currentAddress.url,
          'google-place-id': this.currentAddress.place_id,
          street_location: this.currentAddress.formatted_address
        };
      } else {
        venue.address = this.venue?.address;
      }

      const mergedVenue = Object.assign(this.venue, venue);

      if (client !== this.currentAccount.uuid) {
        this.accountService
          .updateClientVenueByUUID(this.currentAccount.uuid, client, this.venue?.uuid, mergedVenue)
          .pipe(
            switchMap((res) => {
              this.viewMode = 'view';
              this.editVenueForm.reset();
              this.accountService.getConnectedVenues(this.currentAccount.uuid);
              return this.accountService.setCurrentAccount(this.currentAccount.uuid);
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe();
      } else {
        this.accountService
          .updateAccountVenueByUUID(this.currentAccount.uuid, this.venue?.uuid, mergedVenue)
          .pipe(
            switchMap((res) => {
              this.viewMode = 'view';
              this.editVenueForm.reset();
              this.accountService.getConnectedVenues(this.currentAccount.uuid);
              return this.accountService.setCurrentAccount(this.currentAccount.uuid);
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe();
      }
    }
  }

  changeType(e) {
    this.viewLicence = true;
    // this.editVenueForm.get('licenceNumber').setValidators(Validators.required);
    this.editVenueForm.get('licenceNumber').patchValue(this.venue?.licence_number);

    // if (e.value === 'Private') {
    //   this.viewLicence = false;
    //   this.editVenueForm.get('licenceNumber').removeValidators(Validators.required);
    //   this.editVenueForm.get('licenceName').removeValidators(Validators.required);
    //   this.editVenueForm.removeControl('licenceNumber');
    //   this.editVenueForm.removeControl('licenceName');
    // } else if (e.value === 'Public') {
    //   this.viewLicence = true;
    //   this.editVenueForm.addControl('licenceName', new FormControl(''));
    //   this.editVenueForm.addControl('licenceNumber', new FormControl(''));
    //   this.editVenueForm.get('licenceNumber').setValidators(Validators.required);
    //   this.editVenueForm.get('licenceName').setValidators(Validators.required);
    //   this.editVenueForm.get('licenceNumber').patchValue(this.venue?.licence_number);
    //   this.editVenueForm.get('licenceName').patchValue(this.venue?.licence_name);
    // }
    // don't know what is the purpose of this so I just leave a code block here
    // if (e.value === 'Private') {
    //   this.viewLicence = false;
    //   this.editVenueForm.get('licenceNumber').removeValidators(Validators.required);
    //   this.editVenueForm.removeControl('licenceNumber');
    // } else if (e.value === 'Public') {
    //   this.viewLicence = true;
    //   this.editVenueForm.addControl('licenceNumber', new FormControl(''));
    //   this.editVenueForm.get('licenceNumber').setValidators(Validators.required);
    //   this.editVenueForm.get('licenceNumber').patchValue(this.venue?.licence_number);
    // }
  }

  delete() {
    this.accountService
      .deleteAccountVenueByUUID(this.currentAccount.uuid, this.venue?.uuid)
      .pipe(
        tap((res) => {
          this.router.navigate(['/pages/list-venues']);
        }),
        catchError((err) => {
          if (err.statusText === 'OK') {
            this.deletedVenue.emit(err?.error);
            this.router.navigate(['/pages/list-venues']);
          }
          return of(err);
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  cancel() {
    this.viewMode = 'view';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    this.accountService.setPauseRefresh(false);
  }
}
