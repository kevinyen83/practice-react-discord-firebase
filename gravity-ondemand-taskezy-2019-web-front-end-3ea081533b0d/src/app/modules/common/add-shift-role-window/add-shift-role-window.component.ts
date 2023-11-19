import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { FuseAlertType } from '../../../../@fuse/components/alert';
import { EMPTY, Subject, switchMap } from 'rxjs';

import { AccountService } from '../../../core/services/account/account.service';
import { ComplianceService } from '../../../core/services/compliance/compliance.service';
import { VenuesService } from "../../../core/services/venues/venues.service";

@Component({
  selector: 'app-add-shift-role-window',
  templateUrl: './add-shift-role-window.component.html'
})
export class AddShiftRoleWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  addShiftRoleForm: FormGroup;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  status = 'create';
  shiftRole;
  shiftRates = [];
  showAlert = false;
  roles = [];
  currentRate;
  currentVenue;
  currentAccount;
  listAccreditations = [];
  selectedLicences = [];
  currentAccreditations = [];
  connectedVenues = [];
  selectedAccreditations = [];

  @ViewChild('stepper') private myStepper: MatStepper;

  private unsubscribeAll = new Subject();

  constructor(
    private dialogRef: MatDialogRef<AddShiftRoleWindowComponent>,
    private accountService: AccountService,
    private venuesService: VenuesService,
    private complianceService: ComplianceService,
    private _fuseConfirmationService: FuseConfirmationService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);

    this.buildForm();
    this.currentAccount = this.accountService.currentAccount.getValue();
    if (this.data) {
      this.currentVenue = this.data?.venue;
      this.roles = this.data?.venue?.roles || [];
      this.shiftRates = this.data?.venue?.resource_rates || [];
      if (this.data?.currentRole) {
        this.status = 'edit';
        this.setValues(this.data?.currentRole);
        this.currentAccreditations = this.data?.currentRole.credentials;
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.complianceService
        .checkAccreditation()
        .pipe(
          tap((res: any) => {
            if (res) {
              this.listAccreditations = res;
            } else {
              return EMPTY;
            }
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    });
  }

  buildForm() {
    this.addShiftRoleForm = new FormGroup({
      nameResourceRole: new FormControl(''),
      nameShiftRole: new FormControl(''),
      description: new FormControl(''),
      licences: new FormArray([])
    });
  }

  setValues(role) {
    if (role?.credentials && role?.credentials.length) {
      let namesAccred = [];
      role?.credentials.forEach(cred => {
        let item = JSON.parse(cred.data);
        namesAccred.push(item.name);
      });
      this.currentVenue?.accreditation_requirements.forEach(accred => {
        if (namesAccred.includes(accred.name)) {
          accred['selected'] = true;
          this.selectedAccreditations.push(accred);
        }
      });
    }
    let resourceRateId = role.resource_rate_id;
    let rate = this.data?.venue?.resource_rates.find((r) => r.uuid === resourceRateId);
    this.addShiftRoleForm.setValue({
      nameResourceRole: rate,
      nameShiftRole: role?.name,
      description: role?.description,
      licences: []
    });
    this.currentRate = rate;
  }

  get licences() {
    return this.addShiftRoleForm.controls['licences'] as FormArray;
  }

  radioChange(event, index) {
    this.licences.controls[index].patchValue(event.value);
  }

  back() {
    this.selectedLicences = [];
    this.licences.clear();
    this.myStepper.previous();
  }

  addLicence() {
    const licenceForm = new FormGroup({
      accreditationOption: new FormControl('', Validators.required)
    });
    this.licences.push(licenceForm);
  }

  changeFieldResourceRole(e) {
    this.currentRate = e.value;
  }

  // addAccreditations(event) {
  //   this.selectedLicences = event;
  //   this.selectedLicences.forEach(lic => {
  //     if (lic.names && lic?.names?.length) {
  //       lic?.names?.forEach(n => {
  //         this.addLicence();
  //       });
  //     }
  //   });
  //   this.myStepper.next();
  // }

  selectionChange(event) {
    this.selectedLicences = [];
    this.licences.clear();
    if (event.selectedIndex === 2) {
      this.selectedLicences = this.venuesService.selectedLicences;
      this.selectedLicences.forEach(lic => {
        lic?.names?.forEach(n => {
          this.addLicence();
        });
      });
    } else if (event.selectedIndex === 1) {
      this.next();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  selectAccreditation(event, index) {
    if (event.checked) {
      this.selectedAccreditations.push(this.currentVenue.accreditation_requirements[index]);
    } else {
      this.selectedAccreditations = this.selectedAccreditations.filter(a => a.name !== this.currentVenue.accreditation_requirements[index].name);
    }
  }

  next() {
    this.shiftRole = {
      resource_rate_id: this.currentRate?.uuid,
      name: this.addShiftRoleForm.get('nameShiftRole').value,
      rates: this.currentRate?.rates,
      description: this.addShiftRoleForm.get('description').value,
      credentials: [],
      accreditation_requirements: []
    };
    if (this.data?.currentRole) {
      this.shiftRole.uuid = this.data.currentRole.uuid;
    }
  }

  save() {
    this.selectedAccreditations.forEach(lic => {
      let credential = {
        data: JSON.stringify(lic),
        type: lic.type
      }
      this.shiftRole['credentials'].push(credential);
    });
    if (this.addShiftRoleForm.valid) {
      this.getConfirmation();
    } else {
      console.log('Invalid fprm');
    }
  }

  getConfirmation() {
    const confirmDialog = this._fuseConfirmationService.open({
      title: `Save Role`,
      message: `Do you want to save this Role?`,
      icon: {
        show: false
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    });
    confirmDialog.afterClosed().subscribe((res) => {
      const isDirect = this.data.currentAccount?.uuid == this.data.venueClient?.uuid;
      if (res === 'confirmed') {
        if (isDirect) {
          if (this.status === 'create') {
            this.accountService
              .addAccountVenueRole(this.data.currentAccount?.uuid, this.data.venue.uuid, this.shiftRole)
              .pipe(
                switchMap(res => {
                  return this.accountService.setCurrentAccount(this.currentAccount.uuid);
                }),
                tap((res) => {
                  this.accountService.getConnectedVenues(this.data.currentAccount?.uuid);
                  this.dialogRef.close()
                })
              )
              .subscribe();
          } else {
            this.accountService
              .updateAccountVenueRole(this.data.currentAccount?.uuid, this.data.venue, this.shiftRole.uuid, this.shiftRole)
              .pipe(
                switchMap(res => {
                  return this.accountService.setCurrentAccount(this.currentAccount.uuid);
                }),
                tap((res) => {
                  this.accountService.getConnectedVenues(this.data.currentAccount?.uuid);
                  this.dialogRef.close()
                })
              )
              .subscribe();
          }
        } else {
          if (this.status === 'create') {
            this.accountService
              .addClientVenueRole(this.data.currentAccount?.uuid, this.data.venueClient.uuid, this.data.venue.uuid, this.shiftRole)
              .pipe(
                switchMap(res => {
                  return this.accountService.setCurrentAccount(this.currentAccount.uuid);
                }),
                tap((res) => {
                  this.accountService.getConnectedVenues(this.data.currentAccount?.uuid);
                  this.accountService.refreshCurrentAccount();
                  this.dialogRef.close()
                })
              )
              .subscribe();
          } else {
            this.accountService
              .updateClientVenueRole(this.data.currentAccount?.uuid, this.data.venueClient.uuid, this.data.venue.uuid, this.shiftRole.uuid, this.shiftRole)
              .pipe(
                switchMap(res => {
                  return this.accountService.setCurrentAccount(this.currentAccount.uuid);
                }),
                tap((res) => {
                  this.accountService.getConnectedVenues(this.data.currentAccount?.uuid);
                  this.accountService.refreshCurrentAccount();
                  this.dialogRef.close()
                })
              )
              .subscribe();
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);

  }
}
