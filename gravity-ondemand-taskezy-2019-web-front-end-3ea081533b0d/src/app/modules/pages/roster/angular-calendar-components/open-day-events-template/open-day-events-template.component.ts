import { Component, Input, OnInit, Output, EventEmitter, DoCheck, AfterViewChecked, OnChanges, HostListener } from '@angular/core';
import { ContextMenuService } from '@perfectmemory/ngx-contextmenu';
import { collapseAnimation } from "angular-calendar";
import { catchError, EMPTY } from 'rxjs';

import { RosterService } from "../../../../../core/services/roster/roster.service";

@Component({
  selector: 'app-open-day-events-template',
  templateUrl: './open-day-events-template.component.html',
  animations: [collapseAnimation]
})
export class OpenDayEventsTemplateComponent implements OnInit, OnChanges {

  @Input() events;
  @Input() isOpen;
  @Input() eventClicked;
  @Input() contextMenuTemplate;

  @Output() shiftClick = new EventEmitter<any>();
  // statusClickedEvents: number;

  shiftDown = false;

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.shiftDown = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.shiftDown = false;
  }

  constructor() {}

  ngOnChanges(changes) {
    // console.log(changes);
  }

  ngOnInit(): void {
    // this.rosterService.statusClickedEvents
    // .pipe(
    //   catchError((err) => {
    //     console.log(err);
    //     return EMPTY;
    //   }))
    // .subscribe(res => {
    //   console.log(res);
    //   console.log(this.events);
    //   this.statusClickedEvents = res;
    // });
  }

  clickOnEvent(e, event) {
    e.stopPropagation();
    if (this.shiftDown) {
      this.shiftClick.emit(event);
    } else {
      this.eventClicked.emit({ event, sourceEvent: e });
    }
  }

}
