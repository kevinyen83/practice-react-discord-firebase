import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html'
})
export class EditShiftComponent implements OnInit, OnDestroy {
  @Input() currentShift;
  @Input() viewAs;
  @Output() closeSideBar = new EventEmitter<any>();

  @ViewChild('address', { read: true, static: false })
  header = 'Edit Shift';
  status = 'edit';

  public searchElementRef: ElementRef;

  private unsubscribeAll = new Subject();

  constructor(private router: Router, public dialog: MatDialog, public accountService: AccountService) {}

  ngOnInit() {}

  closeSideNav(event) {
    this.closeSideBar.emit(event);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
