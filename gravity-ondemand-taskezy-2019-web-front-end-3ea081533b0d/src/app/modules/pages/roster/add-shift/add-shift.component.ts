import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSettings } from 'app/settings/app-settings';

import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html'
})
export class AddShiftComponent implements OnInit {
  @Input() currentAccount;
  @Input() addShiftData;
  @Output() closeSideBar = new EventEmitter<any>();
  @Input() viewMode;

  status = 'add';

  constructor(public accountService: AccountService) {}

  ngOnInit() {
    if (this.viewMode === AppSettings.ROSTER_VIEW_MODE_CLIENT || this.viewMode === AppSettings.ROSTER_VIEW_MODE_SUPPLIER) {
    }
  }

  closeSideNav(event) {
    this.closeSideBar.emit(event);
    // this.dialogRef.close();
  }
}
