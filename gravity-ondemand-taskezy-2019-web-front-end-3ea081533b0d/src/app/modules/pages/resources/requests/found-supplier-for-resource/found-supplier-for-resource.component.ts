import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-found-supplier-for-resource',
  templateUrl: './found-supplier-for-resource.component.html',
})
export class FoundSupplierForResourceComponent implements OnInit {
  @Input() resources;
  @Output() sendConnectionRequests = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  sendConnection(resource) {
    this.sendConnectionRequests.emit(resource);
  }

}
