import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';

import * as moment from 'moment';
import {RosterService} from "../../../../../core/services/roster/roster.service";

@Component({
  selector: 'app-cell-template',
  templateUrl: './cell-template.component.html'
})
export class CellTemplateComponent implements OnInit, OnChanges {

  @Input() day;
  @Input() openDay;
  @Input() locale;
  @Input() tooltipDelay;
  @Input() tooltipPlacement;
  @Input() tooltipTemplate;
  @Input() tooltipAppendToBody;
  // @Output() highlightDay = new EventEmitter();
  // @Output() unhighlightDay = new EventEmitter();
  @Output() openMenu = new EventEmitter<any>();


  showEvents = false;
  statusNumber = null;

  draftEvents = [];
  pendingEvents = [];
  acceptedEvents = [];
  declinedEvents = [];
  openedDays = [];
  hours = 0;
  resources = 0;

  isOpen = false;

  constructor(private rosterService: RosterService) { }

  ngOnInit(): void {
    this.getCountStatus();
  }

  ngOnChanges(changes) {
    // console.log(changes);
    if(changes['day']) {
      this.getCountStatus();
    }
    if(changes['openDay']) {
      this.isOpen = moment(this.openDay).isSame(this.day, 'day');
    }
  }

  getCountStatus() {
    let draftEvents = [];
    let pendingEvents = [];
    let acceptedEvents = [];
    let declinedEvents = [];

    let resources = 0;
    let hours = 0;

    this.day?.events.sort((left, right) => {
      return moment.utc(left.start).diff(moment.utc(right.start))
    });

    this.day?.events.forEach(e => {
        if (e.rawShift.release_status === 0) {
          draftEvents.push(e);
        } else if (e.rawShift.resource_status === 2 || e.rawShift.supplier_status === 2) {
          declinedEvents.push(e);
        } else if (e.rawShift.resource_status === 1 || e.rawShift.supplier_status === 1 ||
          e.rawShift.resource_status === 0 || e.rawShift.supplier_status === 0 ||
          e.rawShift.resource_status === undefined || e.rawShift.supplier_status === undefined
          ) {
          pendingEvents.push(e);
        } else if (e.rawShift.resource_status === 3 || e.rawShift.supplier_status === 3) {
          acceptedEvents.push(e);
        }
        resources += e.rawShift.tasks.length;
        hours += e.rawShift.duration * e.rawShift.tasks.length;
    });

    this.draftEvents = draftEvents;
    this.pendingEvents = pendingEvents;
    this.acceptedEvents = acceptedEvents;
    this.declinedEvents = declinedEvents;
    this.hours = hours/60;
    this.resources = resources;
  }

  getMenu(status) {
    localStorage.setItem('openedDay', this.day?.date);
    let shiftData;
    switch(status) {
      case 'draft':
        this.statusNumber === 0 ? this.statusNumber = null : this.statusNumber = 0;
        shiftData = {date: this.day.date, events: this.draftEvents, status: this.statusNumber};
        break;
      case 'declined':
        this.statusNumber === 3 ? this.statusNumber = null : this.statusNumber = 3;
        shiftData = {date: this.day.date, events: this.declinedEvents, status: this.statusNumber};
        this.openMenu.emit(shiftData);
        break;
      case 'pending':
        this.statusNumber === 1 ? this.statusNumber = null : this.statusNumber = 1;
        shiftData = {date: this.day.date, events: this.pendingEvents, status: this.statusNumber};
        this.openMenu.emit(shiftData);
        break;
      case 'accepted':
        this.statusNumber === 2 ? this.statusNumber = null : this.statusNumber = 2;
        shiftData = {date: this.day.date, events: this.acceptedEvents, status: this.statusNumber};
        this.openMenu.emit(shiftData);
        break;
    }
    this.rosterService.shiftData = shiftData;
  }

}
