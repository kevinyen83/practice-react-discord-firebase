import { Component, Input, OnInit } from '@angular/core';

import { tap } from "rxjs/operators";
import * as Moment from "moment";
import { extendMoment } from "moment-range";
import { of, Subject } from 'rxjs';
const moment = extendMoment(Moment);

import { RosterService } from "../../../../core/services/roster/roster.service";
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-roster-details',
  templateUrl: './roster-details.component.html',
  animations: fuseAnimations
})
export class RosterDetailsComponent implements OnInit {
  columns = ['Date/time', 'Resource', 'Supplier', 'Client', 'Venue', 'Status'];
  tasks = [];
  viewDate: Date = moment().startOf("d").toDate();

  @Input() currentAccount: any = {};
  @Input() currentResource: any = {};

  private unsubscribeAll = new Subject();

  constructor(private rosterService: RosterService) {}

  ngOnInit(): void {
    this.dateChanged()
  }

  viewDateString() {
    const viewDate = moment(this.viewDate);
    return viewDate.format("MMMM y")
  }

  dateChanged() {
    const year = moment().isoWeekYear();
    const week = moment().isoWeek();
    this.fetchShiftsByWeek(year, week)
    .pipe(
      tap((res: any) => {
        this.tasks = res;
      })
    )
    .subscribe();
  }

  fetchShiftsByWeek(year, week) {
    if (this.currentAccount.uuid) {
      return this.rosterService.getShiftsForResourceWithYearAndWeek(this.currentAccount.uuid, this.currentResource.uuid, year, week);
    } else {
      return of([]);
    }
  }

  gotoDate(event: any) {
    this.viewDate = moment(event).startOf("day").toDate();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
