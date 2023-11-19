import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { catchError, combineLatest, EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-payment-plane',
  templateUrl: './payment-plane.component.html'
})
export class PaymentPlaneComponent implements OnInit, OnDestroy {
  planesMonth: any = [];
  planesYear: any = [];
  currentPlanes = [];
  currentTypePlane = 'month';
  unsubscribeAll = new Subject();

  @Output() toBack = new EventEmitter<any>();

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
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
        this.planesMonth = res[0];
        this.planesYear = res[1];
        this.currentPlanes = [...this.planesMonth];
        this.accountService.currentTypePlane = this.currentTypePlane;
      });
  }

  getCurrentPlane(type) {
    this.currentTypePlane = type;
    this.accountService.currentTypePlane = this.currentTypePlane;
    if (type === 'month') {
      this.currentPlanes = [...this.planesMonth];
    }
    if (type === 'year') {
      this.currentPlanes = [...this.planesYear];
    }
  }

  addCurrentPaymentPlane(card) {
    this.toBack.emit(card);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
