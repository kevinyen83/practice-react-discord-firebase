import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-found-supplier',
  templateUrl: './found-supplier.component.html'
})
export class FoundSupplierComponent implements OnInit {
  @Input() suppliers;
  @Output() sendConnectionRequests = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  sendConnection(supplier) {
    this.sendConnectionRequests.emit(supplier);
  }
}
