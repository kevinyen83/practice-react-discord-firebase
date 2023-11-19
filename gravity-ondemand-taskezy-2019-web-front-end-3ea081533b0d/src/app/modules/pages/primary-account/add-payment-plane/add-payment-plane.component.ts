import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { catchError, combineLatest, EMPTY, Subject } from 'rxjs';
import { StripeService } from 'ngx-stripe';

import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-payment-plane',
  templateUrl: './add-payment-plane.component.html',
  animations: fuseAnimations
})
export class AddPaymentPlaneComponent implements OnInit {
  currentPlane: string;
  typesOfPlanes: any = [];
  isSelectedPlane: boolean = false;
  addPaymentForm: FormGroup;
  cardOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
  elementsOptions = {
    locale: 'es'
  };
  unsubscribeAll = new Subject();

  @Input() currentEvent;
  @Output() nextStep = new EventEmitter<any>();

  constructor(private accountService: AccountService, private stripeService: StripeService, private router: Router) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.currentPlane = this.accountService.currentTypePlane;
    this.buildForm();
    combineLatest([
      this.accountService.getPlanesMonth(),
      this.accountService.getPlanesYear()
    ])
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        if (this.accountService.currentTypePlane === 'month') {
          this.typesOfPlanes = res[0];
        }
        if (this.accountService.currentTypePlane === 'year') {
          this.typesOfPlanes = res[1];
        }
      });
  }

  changePlan(event) {
    if (event.value) {
      this.isSelectedPlane = true;
    }
  }

  buildForm() {
    this.addPaymentForm = new FormGroup({
      type: new FormControl(''),
      cardNumber: new FormControl(''),
      cardholderName: new FormControl(''),
      validThrough: new FormControl(''),
      cvv: new FormControl('', Validators.maxLength(3)),
      isSavedPayment: new FormControl(false)
    });
  }

  buy(amount) {
    // console.log(this.card);
    // this.accountService.checkout(amount);
    let name = this.addPaymentForm.get('cardholderName').value;
    this.router.navigate(['/pages/home']);
    //   this.stripeService
    //     .createToken(this.card.element, { name })
    //     .subscribe((result) => {
    //       if (result.token) {
    //         // Use the token
    //         console.log(result.token.id);
    //       } else if (result.error) {
    //         // Error creating the token
    //         console.log(result.error.message);
    //       }
    //     });
    //   this.nextStep.emit('completeAccountDetails');
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
