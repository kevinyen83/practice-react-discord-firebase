import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter, HostListener
} from '@angular/core';

import { RosterService } from "../../../../../core/services/roster/roster.service";

@Component({
  selector: 'app-event-week-template',
  templateUrl: './event-week-template.component.html'
})
export class EventWeekTemplateComponent implements OnInit {
  shiftDown: boolean;

  @Input() weekEvent;
  @Input() eventClicked;
  // @Input() indexFirst: number;
  // @Input() indexSecond: number;
  // @Input() daysInWeek;
  // @Input() contextMenu;

  @Output() shiftClick = new EventEmitter<any>();
  // @Output() rightClick = new EventEmitter<any>();

  event;

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.shiftDown = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.shiftDown = false;
  }

  // @HostListener('contextmenu')
  // preventContextMenu() {
  //     this.rightClick.emit(this.weekEvent.event);
  //     return false;
  // }

  constructor(private rosterService: RosterService) { }

  ngOnInit(): void {
    if(this.weekEvent.event) {
      this.event = this.weekEvent.event
    } else {
      this.event = this.weekEvent;
    }
    // this.rosterService.clickedId
    // .pipe(
    //   catchError((err) => {
    //     console.log(err);
    //     return EMPTY;
    //   }))
    // .subscribe(res => {
    //   this.clickedId = res;
    // });
  }

  clickOnEvent(e) {
    e.stopPropagation();
    if (this.shiftDown) {
      this.shiftClick.emit(this.event);
    } else {
      this.eventClicked.emit({ sourceEvent: e });
    }
  }

}
