import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modify-payment-method',
  templateUrl: './modify-payment-method.component.html'
})
export class ModifyPaymentMethodComponent implements OnInit {

  @Output() return = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  save() {
    this.returnToSubscription();
  }

  returnToSubscription() {
    this.return.emit();
  }

}
