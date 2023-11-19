import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { EMPTY, Subject, tap } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-add-rate-window',
  templateUrl: './add-rate-window.component.html'
})
export class AddRateWindowComponent implements OnInit, OnDestroy {
  addRateForm: FormGroup;
  status = 'add';
  currentRate;
  statusHeader = 'Add New';
  rates = [
    {
      name: 'Standard',
      value: '',
      itemCode: ''
    },
    {
      name: 'Premium',
      value: '',
      itemCode: ''
    },
    {
      name: 'Discount',
      value: '',
      itemCode: ''
    }
  ];
  private unsubscribeAll = new Subject();

  constructor(public accountService: AccountService, public dialogRef: MatDialogRef<AddRateWindowComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildForm();
    if (this.data.currentRate) {
      this.status = 'edit';
      this.currentRate = this.data.currentRate;
      this.statusHeader = this.status.charAt(0).toUpperCase() + this.status.slice(1);
      this.setValues(this.currentRate);
    }
  }

  buildForm() {
    this.addRateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      rates: new FormArray([])
    });
    this.rates.forEach((rate) => {
      (this.addRateForm.get('rates') as FormArray).push(this.addRate(rate.name));
    });
  }

  toPositive(event, i) {
    let val = this.addRateForm.get("rates")['controls'][i].get('value');
    this.addRateForm.get("rates")['controls'][i].get('value').patchValue(Math.abs(val.value));
  }

  setValues(role) {
    this.addRateForm.patchValue({
      name: role.name,
      description: role.description,
      rates: role.rates
    });
  }

  addRate(name?) {
    return new FormGroup({
      name: new FormControl(name || ''),
      value: new FormControl(0),
      item_code: new FormControl('')
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    let rate = this.addRateForm.value;

    // const accnt = this.accountService.currentAccount.getValue();
    const isDirect = this.data.currentAccount?.uuid == this.data.venueClient?.uuid;
    if (this.addRateForm.valid) {
      if (isDirect) {
        if (this.status === 'add') {
          this.accountService
            .addAccountVenueRate(this.data.currentAccount.uuid, this.data.venue.uuid, rate)
            .pipe(
              tap((res) => {
                this.accountService.getConnectedVenues(this.data.currentAccount.uuid);
              }),
              catchError((err) => {
                console.log(err);
                return EMPTY;
              }),
              finalize(() => this.dialogRef.close())
            )
            .subscribe();
        } else if (this.status === 'edit') {
          this.accountService
            .updateAccountVenueRate(this.data.currentAccount.uuid, this.data.venue.uuid, this.currentRate.uuid, rate)
            .pipe(
              tap((res) => {
                this.accountService.getConnectedVenues(this.data.currentAccount.uuid);
              }),
              catchError((err) => {
                console.log(err);
                return EMPTY;
              }),
              finalize(() => this.dialogRef.close())
            )
            .subscribe();
        }
      } else if (!isDirect) {
        if (this.status === 'add') {
          this.accountService
            .addClientVenueRate(this.data.currentAccount.uuid, this.data.venueClient.uuid, this.data.venue.uuid, rate)
            .pipe(
              tap((res) => {
                this.accountService.getConnectedVenues(this.data.currentAccount.uuid);
                this.accountService.refreshCurrentAccount();
              }),
              catchError((err) => {
                console.log(err);
                return EMPTY;
              }),
              finalize(() => this.dialogRef.close())
            )
            .subscribe();
        } else if (this.status === 'edit') {
          this.accountService
            .updateClientVenueRate(this.data.currentAccount.uuid, this.data.venueClient.uuid, this.data.venue.uuid, this.currentRate.uuid, rate)
            .pipe(
              tap((res) => {
                this.accountService.getConnectedVenues(this.data.currentAccount.uuid);
                this.accountService.refreshCurrentAccount();
              }),
              catchError((err) => {
                console.log(err);
                return EMPTY;
              }),
              finalize(() => this.dialogRef.close())
            )
            .subscribe();
        }
      }
    }

    this.dialogRef.close(rate);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
