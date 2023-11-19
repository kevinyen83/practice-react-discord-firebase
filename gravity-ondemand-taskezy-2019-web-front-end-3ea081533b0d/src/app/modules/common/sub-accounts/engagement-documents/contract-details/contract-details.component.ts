import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Subject, tap } from 'rxjs';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  animations: fuseAnimations
})
export class ContractDetailsComponent implements OnInit {
  contractDetailsForm: FormGroup;
  @Input() venue;
  @Input() venueClient;
  editing = false;

  private unsubscribeAll = new Subject();

  constructor(public accountService: AccountService,
    ) {
    }

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildForm();
  }

  reviewDates() {
   let startValue = this.contractDetailsForm.get('contract_start_date').value;
   let endValue = this.contractDetailsForm.get('contract_review_date').value;
   if (startValue) {
     this.contractDetailsForm.get('contract_start_date').markAsTouched();
   } else if (endValue) {
     this.contractDetailsForm.get('contract_review_date').markAsTouched();
   }
   if (startValue && endValue) {
     if (moment(startValue).isBefore(endValue)) {
       this.contractDetailsForm.get('contract_start_date').setErrors(null);
       this.contractDetailsForm.get('contract_review_date').setErrors(null);
     } else {
       this.contractDetailsForm.get('contract_start_date').setErrors({pastDate: true});
       this.contractDetailsForm.get('contract_review_date').setErrors({pastDate: true});
     }
   }
  }

  buildForm() {
    this.contractDetailsForm = new FormGroup({
      contract_start_date: new FormControl(''),
      contract_term: new FormControl(''),
      contract_review_date: new FormControl(''),
      executing_parties: new FormControl(''),
      comment: new FormControl('')
    });
  }

  edit() {
    this.contractDetailsForm.setValue({
      contract_start_date: this.venue?.contract_start_date,
      contract_term: this.venue?.contract_term,
      contract_review_date: this.venue?.contract_review_date,
      executing_parties: this.venue?.executing_parties,
      comment: this.venue?.comment
    });

    this.editing = !this.editing;
  }

  cancel() {
    this.editing = false;
    this.contractDetailsForm.reset();
  }

  save() {
    if (this.contractDetailsForm.valid) {
      let contract = this.contractDetailsForm.value;

      const accnt = this.accountService.currentAccount.getValue();
      const isDirect = accnt.uuid == this.venueClient.uuid;
      console.log('accnt.uuid', accnt.uuid);
      console.log('venueClient.uuid', this.venueClient.uuid);
      console.log('isDirect', isDirect);

      const mergedVenue = Object.assign(this.venue, contract);

      if (isDirect) {
        this.accountService
          .updateAccountVenueByUUID(accnt.uuid, this.venue.uuid, mergedVenue)
          .pipe(
            tap((res) => {
              this.accountService.getConnectedVenues(accnt.uuid);
              this.editing = false;
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe();
      } else {
        this.accountService
          .updateClientVenueByUUID(accnt.uuid, this.venueClient.uuid, this.venue.uuid, mergedVenue)
          .pipe(
            tap((res) => {
              this.accountService.getConnectedVenues(accnt.uuid);
              this.editing = false;
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe();
      }
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
