import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddInterviewComponent implements OnInit, OnDestroy {
  @ViewChild('address', { read: true, static: false }) address;
  @Input() statusForm;
  @Input() currentInterview;
  @Output() viewAddInterview = new EventEmitter<any>();

  addInterviewForm: FormGroup;
  formViewing: FormGroup;
  currentLatitude: number;
  currentLongitude: number;
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerOptions = { draggable: true };
  mapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false
  };
  zoom: number;
  mapIsVisible = false;
  interviews = [];
  currentId: string;
  currentAddress;
  currentState;
  viewContinueInterview = false;
  accreditationTypes = [
    'NSW Security Licence',
    'VIC Security Licence',
    'QLD Security Licence',
    'WA Security Licence'
  ];
  states = [
    'ACT',
    'NSW',
    'QLD',
    'VIC',
    'WA',
    'SA',
    'TAS',
    'NT'
  ];
  typesRSALicence = [
    'None',
    'NSW Responsible Service of Alcohol',
    'VIC Responsible Service of Alcohol',
    'QLD Responsible Service of Alcohol',
    'WA Responsible Service of Alcohol'
  ];
  unsubscribeAll = new Subject<any>();
  viewNswResponsible = false;
  viewVicResponsible = false;
  viewQldResponsible = false;
  viewWAResponsible = false;
  dataSignature;
  viewDetailsSpeak = false;
  viewDetailsCriminalOffence = false;
  viewDetailsAvo = false;
  viewDetailsLicenceRevoked = false;
  viewInjuries = false;
  viewAnotherCompanyDetails = false;
  viewInClubDetails = false;
  viewRSLDetails = false;
  viewSecurityLicence = true;
  viewNumberLicence = false;
  viewWANumberLicence = false;
  colorErrorAvailability = false;
  public searchElementRef: ElementRef;

  constructor(private resourceService: ResourcesService, private ngZone: NgZone, private renderer: Renderer2, private el: ElementRef, private accountService: AccountService) {}

  ngOnInit() {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.createAddInterviewForm();
    if (this.statusForm === 'view') {
      this.createViewInterviewForm();
      this.createFormViewing();
      if (this.currentInterview.speakAnswer === 'Yes') {
        this.viewDetailsSpeak = true;
        this.addInterviewForm.addControl(
          'detailsSpeak',
          new FormControl({
            value: this.currentInterview.detailsSpeak,
            disabled: true
          })
        );
      }
      if (this.currentInterview.criminalOffenceAnswer === 'Yes') {
        this.viewDetailsCriminalOffence = true;
        this.addInterviewForm.addControl(
          'detailsCriminalOffence',
          new FormControl({
            value: this.currentInterview.detailsCriminalOffence,
            disabled: true
          })
        );
      }
      if (this.currentInterview.avoAnswer === 'Yes') {
        this.viewDetailsAvo = true;
        this.addInterviewForm.addControl(
          'detailsAvo',
          new FormControl({
            value: this.currentInterview.detailsAvo,
            disabled: true
          })
        );
      }
      if (this.currentInterview.licenceRevokedAnswer === 'Yes') {
        this.viewDetailsLicenceRevoked = true;
        this.addInterviewForm.addControl(
          'detailsLicenceRevoked',
          new FormControl({
            value: this.currentInterview.detailsLicenceRevoked,
            disabled: true
          })
        );
      }
      if (this.currentInterview.injuriesAnswer === 'Yes') {
        this.viewInjuries = true;
      }
      if (this.currentInterview.anotherCompanyAnswer === 'Yes') {
        this.viewAnotherCompanyDetails = true;
        this.addInterviewForm.addControl(
          'detailsInjuries',
          new FormControl({
            value: this.currentInterview.detailsInjuries,
            disabled: true
          })
        );
      }
      if (this.currentInterview.inClubAnswer === 'Yes') {
        this.viewInClubDetails = true;
        this.addInterviewForm.addControl(
          'detailsInClub',
          new FormControl({
            value: this.currentInterview.detailsInClub,
            disabled: true
          })
        );
      }
      if (this.currentInterview.inRSLAnswer === 'Yes') {
        this.viewRSLDetails = true;
        this.addInterviewForm.addControl(
          'detailsRSL',
          new FormControl({
            value: this.currentInterview.detailsRSL,
            disabled: true
          })
        );
      }

      if (this.currentInterview.typeRSALicence === this.typesRSALicence[0]) {
        this.viewNswResponsible = false;
        this.viewVicResponsible = false;
        this.viewQldResponsible = false;
        this.viewWAResponsible = false;
      }
      if (this.currentInterview.typeRSALicence === this.typesRSALicence[1]) {
        this.viewNswResponsible = true;
        this.viewVicResponsible = false;
        this.viewQldResponsible = false;
        this.viewWAResponsible = false;
        this.addInterviewForm.addControl(
          'accreditationNumber',
          new FormControl({
            value: this.currentInterview.accreditationNumber,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'expiresAtLicenceNsw',
          new FormControl({
            value: this.currentInterview.expiresAtLicenceNsw,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'classA',
          new FormControl({
            value: this.currentInterview.classA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'classG',
          new FormControl({
            value: this.currentInterview.classG,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'classH',
          new FormControl({
            value: this.currentInterview.classH,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'classP',
          new FormControl({
            value: this.currentInterview.classP,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'typeLicenceNSW',
          new FormControl({
            value: this.currentInterview.typeLicenceNSW,
            disabled: true
          })
        );
      }
      if (this.currentInterview.typeRSALicence === this.typesRSALicence[2]) {
        this.viewVicResponsible = true;
        this.viewNswResponsible = false;
        this.viewQldResponsible = false;
        this.viewWAResponsible = false;
        this.addInterviewForm.addControl(
          'expiresAtLicenceVic',
          new FormControl({
            value: this.currentInterview.expiresAtLicenceVic,
            disabled: true
          })
        );
      }
      if (this.currentInterview.typeRSALicence === this.typesRSALicence[3]) {
        this.viewQldResponsible = true;
        this.viewVicResponsible = false;
        this.viewNswResponsible = false;
        this.viewWAResponsible = false;
        this.addInterviewForm.addControl(
          'licenceStatusQld',
          new FormControl({
            value: this.currentInterview.licenceStatusQld,
            disabled: true
          })
        );
      }
      if (this.currentInterview.typeRSALicence === this.typesRSALicence[4]) {
        this.viewWAResponsible = true;
        this.viewQldResponsible = false;
        this.viewVicResponsible = false;
        this.viewNswResponsible = false;
        this.addInterviewForm.addControl(
          'licenceStatusWA',
          new FormControl({
            value: this.currentInterview.licenceStatusWA,
            disabled: true
          })
        );
      }
      if (this.currentInterview.guardType === 'RSA Marshall') {
        this.viewSecurityLicence = false;
      } else {
        this.viewSecurityLicence = true;
      }
      if (this.currentInterview.typeLicence === this.accreditationTypes[0] || this.currentInterview.typeLicence === this.accreditationTypes[1] || this.currentInterview.typeLicence === this.accreditationTypes[2]) {
        this.viewNumberLicence = true;
        this.viewWANumberLicence = false;
        this.addInterviewForm.addControl(
          'licenceNumber',
          new FormControl({
            value: this.currentInterview.licenceNumber,
            disabled: true
          })
        );
      }
      if (this.currentInterview.typeLicence === this.accreditationTypes[3]) {
        this.viewNumberLicence = false;
        this.viewWANumberLicence = true;
        this.addInterviewForm.addControl(
          'licenceNumberWA',
          new FormControl({
            value: this.currentInterview.licenceNumberWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'expiresAtWA',
          new FormControl({
            value: this.currentInterview.expiresAtWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'crowdControlAgentWA',
          new FormControl({
            value: this.currentInterview.crowdControlAgentWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'crowdControllerWA',
          new FormControl({
            value: this.currentInterview.crowdControllerWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'crowdInquiryAgentWA',
          new FormControl({
            value: this.currentInterview.crowdInquiryAgentWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'investigatorWA',
          new FormControl({
            value: this.currentInterview.investigatorWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'securityAgentWA',
          new FormControl({
            value: this.currentInterview.securityAgentWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'securityBodyguardWA',
          new FormControl({
            value: this.currentInterview.securityBodyguardWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'securityConsultantWA',
          new FormControl({
            value: this.currentInterview.securityConsultantWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'securityInstallerWA',
          new FormControl({
            value: this.currentInterview.securityInstallerWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'securityOfficerWA',
          new FormControl({
            value: this.currentInterview.securityOfficerWA,
            disabled: true
          })
        );
        this.addInterviewForm.addControl(
          'securityCompanyWA',
          new FormControl({
            value: this.currentInterview.securityCompanyWA,
            disabled: true
          })
        );
      }
    }
    this.resourceService
      .getInterviews()
      .pipe(
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.interviews = res[0].data;
      });
    this.addInterviewForm
      .get('address')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value) {
          this.mapIsVisible = true;
          this.getMap();
        }
        this.checkQuestions();
      });
    this.addInterviewForm
      .get('typeRSALicence')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === this.typesRSALicence[0]) {
          this.viewNswResponsible = false;
          this.viewVicResponsible = false;
          this.viewQldResponsible = false;
          this.viewWAResponsible = false;
        }
        if (value === this.typesRSALicence[1]) {
          this.viewNswResponsible = true;
          this.viewVicResponsible = false;
          this.viewQldResponsible = false;
          this.viewWAResponsible = false;
          this.addInterviewForm.addControl('accreditationNumber', new FormControl(''));
          this.addInterviewForm.addControl('expiresAtLicenceNsw', new FormControl(''));
          this.addInterviewForm.addControl('classA', new FormControl(false));
          this.addInterviewForm.addControl('classG', new FormControl(false));
          this.addInterviewForm.addControl('classH', new FormControl(false));
          this.addInterviewForm.addControl('classP', new FormControl(false));
          this.addInterviewForm.addControl('typeLicenceNSW', new FormControl(''));
        }
        if (value === this.typesRSALicence[2]) {
          this.viewVicResponsible = true;
          this.viewNswResponsible = false;
          this.viewQldResponsible = false;
          this.viewWAResponsible = false;
          this.addInterviewForm.addControl('expiresAtLicenceVic', new FormControl(''));
        }
        if (value === this.typesRSALicence[3]) {
          this.viewQldResponsible = true;
          this.viewVicResponsible = false;
          this.viewNswResponsible = false;
          this.viewWAResponsible = false;
          this.addInterviewForm.addControl('licenceStatusQld', new FormControl(''));
        }
        if (value === this.typesRSALicence[4]) {
          this.viewWAResponsible = true;
          this.viewQldResponsible = false;
          this.viewVicResponsible = false;
          this.viewNswResponsible = false;
          this.addInterviewForm.addControl('licenceStatusWA', new FormControl(''));
        }
        this.checkQuestions();
      });
    this.addInterviewForm
      .get('guardType')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'RSA Marshall') {
          this.viewSecurityLicence = false;
        } else {
          this.viewSecurityLicence = true;
        }
        this.checkQuestions();
      });

    this.addInterviewForm
      .get('typeLicence')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === this.accreditationTypes[0] || value === this.accreditationTypes[1] || value === this.accreditationTypes[2]) {
          this.viewNumberLicence = true;
          this.viewWANumberLicence = false;
          this.addInterviewForm.addControl('licenceNumber', new FormControl(''));
        }
        if (value === this.accreditationTypes[3]) {
          this.viewNumberLicence = false;
          this.viewWANumberLicence = true;
          this.addInterviewForm.addControl('licenceNumberWA', new FormControl(''));
          this.addInterviewForm.addControl('expiresAtWA', new FormControl(''));
          this.addInterviewForm.addControl('crowdControlAgentWA', new FormControl(false));
          this.addInterviewForm.addControl('crowdControllerWA', new FormControl(false));
          this.addInterviewForm.addControl('crowdInquiryAgentWA', new FormControl(false));
          this.addInterviewForm.addControl('investigatorWA', new FormControl(false));
          this.addInterviewForm.addControl('securityAgentWA', new FormControl(false));
          this.addInterviewForm.addControl('securityBodyguardWA', new FormControl(false));
          this.addInterviewForm.addControl('securityConsultantWA', new FormControl(false));
          this.addInterviewForm.addControl('securityInstallerWA', new FormControl(false));
          this.addInterviewForm.addControl('securityOfficerWA', new FormControl(false));
          this.addInterviewForm.addControl('securityCompanyWA', new FormControl(false));
        }
      });

    this.addInterviewForm
      .get('speakAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewDetailsSpeak = true;
          this.addInterviewForm.addControl('detailsSpeak', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewDetailsSpeak = false;
        }
      });
    this.addInterviewForm
      .get('criminalOffenceAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewDetailsCriminalOffence = true;
          this.addInterviewForm.addControl('detailsCriminalOffence', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewDetailsCriminalOffence = false;
        }
      });
    this.addInterviewForm
      .get('avoAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewDetailsAvo = true;
          this.addInterviewForm.addControl('detailsAvo', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewDetailsAvo = false;
        }
      });
    this.addInterviewForm
      .get('licenceRevokedAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewDetailsLicenceRevoked = true;
          this.addInterviewForm.addControl('detailsLicenceRevoked', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewDetailsLicenceRevoked = false;
        }
      });
    this.addInterviewForm
      .get('injuriesAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewInjuries = true;
          this.addInterviewForm.addControl('detailsInjuries', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewInjuries = false;
        }
      });
    this.addInterviewForm
      .get('anotherCompanyAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewAnotherCompanyDetails = true;
          this.addInterviewForm.addControl('detailsAnotherCompany', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewAnotherCompanyDetails = false;
        }
      });
    this.addInterviewForm
      .get('inClubAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewInClubDetails = true;
          this.addInterviewForm.addControl('detailsInClub', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewInClubDetails = false;
        }
      });
    this.addInterviewForm
      .get('inRSLAnswer')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value === 'Yes') {
          this.viewRSLDetails = true;
          this.addInterviewForm.addControl('detailsRSL', new FormControl(''));
          this.checkQuestions();
        } else {
          this.viewRSLDetails = false;
        }
      });
    this.addInterviewForm.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe((value) => {
      if (value.monday || value.tuesday || value.wednesday || value.thursday || value.friday || value.saturday || value.sunday) {
        this.colorErrorAvailability = false;
      } else {
        this.colorErrorAvailability = true;
      }
    });
  }

  getMap() {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ['address']
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        this.currentAddress = place;
        place.address_components.forEach((component) => {
          if (component.types.includes('country')) {
            this.currentState = component.short_name;
          }
        });

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.currentLatitude = place.geometry.location.lat();
        this.currentLongitude = place.geometry.location.lng();
        this.loadMap();
      });
    });
  }

  loadMap() {
    this.mapCenter = { lat: this.currentLatitude, lng: this.currentLongitude };
    this.zoom = 12;
  }

  createAddInterviewForm(): FormGroup {
    return (this.addInterviewForm = new FormGroup({
      guardType: new FormControl(''),
      typeLicence: new FormControl(''),
      typeRSALicence: new FormControl(''),
      expiresFirstAidCertificate: new FormControl(''),
      firstName: new FormControl(''),
      mobileNumber: new FormControl('', Validators.required), //phone format validation is built into ngx-mat-intl-tel-input
      lastName: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required), //phone format validation is built into ngx-mat-intl-tel-input
      preferredName: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      gender: new FormControl(''),
      dateOfBirth: new FormControl('', [
        Validators.required,
        dateBirthValidatorInterview
      ]),
      contactName: new FormControl(''),
      contactRelationship: new FormControl(''),
      contactNumber: new FormControl('', Validators.required), //phone format validation is built into ngx-mat-intl-tel-input
      address: new FormControl(''),
      driversLicenceNumber: new FormControl(''),
      expiresAt: new FormControl(''),
      typeDriversLicence: new FormControl(''),
      state: new FormControl(''),
      cCar: new FormControl(false),
      rRider: new FormControl(false),
      hcHeavyCombination: new FormControl(false),
      hrHeavyRigid: new FormControl(false),
      lrLightRigid: new FormControl(false),
      mcMultiCombination: new FormControl(false),
      mrMediumRigid: new FormControl(false),
      speakAnswer: new FormControl(false),
      criminalOffenceAnswer: new FormControl(false),
      avoAnswer: new FormControl(false),
      licenceRevokedAnswer: new FormControl(false),
      injuriesAnswer: new FormControl(false),
      anotherCompanyAnswer: new FormControl(false),
      inClubAnswer: new FormControl(false),
      inRSLAnswer: new FormControl(false),
      monday: new FormControl(false),
      tuesday: new FormControl(false),
      wednesday: new FormControl(false),
      thursday: new FormControl(false),
      friday: new FormControl(false),
      saturday: new FormControl(false),
      sunday: new FormControl(false),
      signature: new FormControl('')
    }));
  }

  createViewInterviewForm() {
    return (this.addInterviewForm = new FormGroup({
      guardType: new FormControl({
        value: this.currentInterview.guardType,
        disabled: true
      }),
      typeLicence: new FormControl({
        value: this.currentInterview.typeLicence,
        disabled: true
      }),
      typeRSALicence: new FormControl({
        value: this.currentInterview.typeRSALicence,
        disabled: true
      }),
      expiresFirstAidCertificate: new FormControl({
        value: this.currentInterview.expiresFirstAidCertificate,
        disabled: true
      }),
      firstName: new FormControl({
        value: this.currentInterview.firstName,
        disabled: true
      }),
      mobileNumber: new FormControl({
        value: this.currentInterview.mobileNumber,
        disabled: true
      }),
      lastName: new FormControl({
        value: this.currentInterview.lastName,
        disabled: true
      }),
      phoneNumber: new FormControl({
        value: this.currentInterview.phoneNumber,
        disabled: true
      }),
      preferredName: new FormControl({
        value: this.currentInterview.preferredName,
        disabled: true
      }),
      email: new FormControl({
        value: this.currentInterview.email,
        disabled: true
      }),
      gender: new FormControl({
        value: this.currentInterview.gender,
        disabled: true
      }),
      dateOfBirth: new FormControl({
        value: this.currentInterview.dateOfBirth,
        disabled: true
      }),
      contactName: new FormControl({
        value: this.currentInterview.contactName,
        disabled: true
      }),
      contactRelationship: new FormControl({
        value: this.currentInterview.contactRelationship,
        disabled: true
      }),
      contactNumber: new FormControl({
        value: this.currentInterview.contactNumber,
        disabled: true
      }),
      address: new FormControl({
        value: this.currentInterview.address,
        disabled: true
      }),
      driversLicenceNumber: new FormControl({
        value: this.currentInterview.driversLicenceNumber,
        disabled: true
      }),
      expiresAt: new FormControl({
        value: this.currentInterview.expiresAt,
        disabled: true
      }),
      typeDriversLicence: new FormControl({
        value: this.currentInterview.typeDriversLicence,
        disabled: true
      }),
      state: new FormControl({
        value: this.currentInterview.state,
        disabled: true
      }),
      cCar: new FormControl({
        value: this.currentInterview.cCar,
        disabled: true
      }),
      rRider: new FormControl({
        value: this.currentInterview.rRider,
        disabled: true
      }),
      hcHeavyCombination: new FormControl({
        value: this.currentInterview.hcHeavyCombination,
        disabled: true
      }),
      hrHeavyRigid: new FormControl({
        value: this.currentInterview.hrHeavyRigid,
        disabled: true
      }),
      lrLightRigid: new FormControl({
        value: this.currentInterview.lrLightRigid,
        disabled: true
      }),
      mcMultiCombination: new FormControl({
        value: this.currentInterview.mcMultiCombination,
        disabled: true
      }),
      mrMediumRigid: new FormControl({
        value: this.currentInterview.mrMediumRigid,
        disabled: true
      }),
      speakAnswer: new FormControl({
        value: this.currentInterview.speakAnswer,
        disabled: true
      }),
      criminalOffenceAnswer: new FormControl({
        value: this.currentInterview.criminalOffenceAnswer,
        disabled: true
      }),
      avoAnswer: new FormControl({
        value: this.currentInterview.avoAnswer,
        disabled: true
      }),
      licenceRevokedAnswer: new FormControl({
        value: this.currentInterview.licenceRevokedAnswer,
        disabled: true
      }),
      injuriesAnswer: new FormControl({
        value: this.currentInterview.injuriesAnswer,
        disabled: true
      }),
      anotherCompanyAnswer: new FormControl({
        value: this.currentInterview.anotherCompanyAnswer,
        disabled: true
      }),
      inClubAnswer: new FormControl({
        value: this.currentInterview.inClubAnswer,
        disabled: true
      }),
      inRSLAnswer: new FormControl({
        value: this.currentInterview.inRSLAnswer,
        disabled: true
      }),
      monday: new FormControl({
        value: this.currentInterview.monday,
        disabled: true
      }),
      tuesday: new FormControl({
        value: this.currentInterview.tuesday,
        disabled: true
      }),
      wednesday: new FormControl({
        value: this.currentInterview.wednesday,
        disabled: true
      }),
      thursday: new FormControl({
        value: this.currentInterview.thursday,
        disabled: true
      }),
      friday: new FormControl({
        value: this.currentInterview.friday,
        disabled: true
      }),
      saturday: new FormControl({
        value: this.currentInterview.saturday,
        disabled: true
      }),
      sunday: new FormControl({
        value: this.currentInterview.sunday,
        disabled: true
      }),
      signature: new FormControl({
        value: this.currentInterview.signature,
        disabled: true
      })
    }));
  }

  createFormViewing() {
    return (this.formViewing = new FormGroup({
      question1: new FormControl({
        value: this.currentInterview.question1,
        disabled: true
      }),
      question2: new FormControl({
        value: this.currentInterview.question2,
        disabled: true
      }),
      question3: new FormControl({
        value: this.currentInterview.question3,
        disabled: true
      }),
      question4: new FormControl({
        value: this.currentInterview.question4,
        disabled: true
      }),
      question5: new FormControl({
        value: this.currentInterview.question5,
        disabled: true
      }),
      question6: new FormControl({
        value: this.currentInterview.question6,
        disabled: true
      }),
      question7: new FormControl({
        value: this.currentInterview.question7,
        disabled: true
      }),
      question8: new FormControl({
        value: this.currentInterview.question8,
        disabled: true
      }),
      question9: new FormControl({
        value: this.currentInterview.question9,
        disabled: true
      }),
      additionalNotes: new FormControl({
        value: this.currentInterview.additionalNotes,
        disabled: true
      }),
      rsaLicence: new FormControl({
        value: this.currentInterview.rsaLicence,
        disabled: true
      }),
      aidCertificate: new FormControl({
        value: this.currentInterview.aidCertificate,
        disabled: true
      }),
      driversLicence: new FormControl({
        value: this.currentInterview.driversLicence,
        disabled: true
      })
    }));
  }

  cancelInterview() {
    this.viewAddInterview.emit(false);
  }

  continueInterview(event) {
    const interview = {
      signature: this.dataSignature
    };
    for (const i in this.addInterviewForm.controls) {
      if (i) {
        interview[i] = this.addInterviewForm.get(i).value;
      }
    }
    if (interview.signature === undefined || interview.signature === '') {
      this.addInterviewForm.get('signature').setErrors({ error: true });
    }
    this.checkQuestions();
    if (this.addInterviewForm.valid) {
      this.interviews.push(interview);
      this.resourceService.updateInterviews(this.interviews);
      // this.currentId = interview.id;
      // there is no id until it is returned from the server
      this.viewContinueInterview = true;
    } else {
      for (const i in this.addInterviewForm.controls) {
        if (this.addInterviewForm.controls[i].invalid) {
          this.toControl();
        }
      }
    }
  }

  checkQuestions() {
    if (!this.addInterviewForm.get('speakAnswer').value) {
      this.addInterviewForm.get('speakAnswer').setErrors({ error: true });
    } else {
      this.addInterviewForm.get('speakAnswer').setErrors(null);
    }
    if (!this.addInterviewForm.get('criminalOffenceAnswer').value) {
      this.addInterviewForm.get('criminalOffenceAnswer').setErrors({ error: true });
    }
    if (!this.addInterviewForm.get('avoAnswer').value) {
      this.addInterviewForm.get('avoAnswer').setErrors({ error: true });
    }
    if (!this.addInterviewForm.get('licenceRevokedAnswer').value) {
      this.addInterviewForm.get('licenceRevokedAnswer').setErrors({ error: true });
    }
    if (!this.addInterviewForm.get('injuriesAnswer').value) {
      this.addInterviewForm.get('injuriesAnswer').setErrors({ error: true });
    }
    if (!this.addInterviewForm.get('anotherCompanyAnswer').value) {
      this.addInterviewForm.get('anotherCompanyAnswer').setErrors({ error: true });
    }
    if (!this.addInterviewForm.get('inClubAnswer').value) {
      this.addInterviewForm.get('inClubAnswer').setErrors({ error: true });
    }
    if (!this.addInterviewForm.get('inRSLAnswer').value) {
      this.addInterviewForm.get('inRSLAnswer').setErrors({ error: true });
    }
    if (
      !this.addInterviewForm.get('monday').value ||
      !this.addInterviewForm.get('tuesday').value ||
      !this.addInterviewForm.get('wednesday').value ||
      !this.addInterviewForm.get('thursday').value ||
      !this.addInterviewForm.get('friday').value ||
      !this.addInterviewForm.get('saturday').value ||
      !this.addInterviewForm.get('sunday').value
    ) {
      this.colorErrorAvailability = true;
    } else {
      this.colorErrorAvailability = false;
    }
  }

  toControl() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid:not(form)');
    invalidControl.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'nearest'
    });
  }

  changeViewAddInterview(event) {
    this.viewContinueInterview = event;
    this.cancelInterview();
  }

  setDataSignature(event): void {
    // console.log(event);
    this.dataSignature = event;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}

export const dateBirthValidatorInterview: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (moment(control.value).isBefore(moment().subtract(1, 'days'))) {
    return null;
  } else {
    return { dateOfBirthInterviewHasError: true };
  }
};
