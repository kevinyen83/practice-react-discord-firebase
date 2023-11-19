import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-found-users',
  templateUrl: './found-users.component.html'
})
export class FoundUsersComponent implements OnInit {
  @Input() suppliers;
  @Output() sendConnectionRequests = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  sendConnection(supplier) {
    this.sendConnectionRequests.emit(supplier);
  }
}
