import { Component, OnInit, Output, EventEmitter, Input, DoCheck } from '@angular/core';

@Component({
  selector: 'app-week-venue-header-template',
  templateUrl: './week-venue-header-template.component.html'
})
export class WeekVenueHeaderTemplateComponent implements OnInit, DoCheck {
  arrowIcon: string = 'arrow_drop_down';

  countResources = 0;
  countHours = 0;

  @Input() venue;
  @Input() days;
  @Input() locale;
  @Input() eventDropped;
  @Input() dragEnter;
  @Input() indexFirst: number;
  @Input() indexSecond: number;
  @Input() openedVenues;
  @Input() releaseDisabled = false;

  @Output() rightClicked = new EventEmitter<any>();
  @Output() toggleContent = new EventEmitter<any>();
  @Output() releaseClicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    if (this.openedVenues?.includes(this.venue?.uuid)) {
      this.arrowIcon = 'arrow_drop_up';
    } else {
      this.arrowIcon = 'arrow_drop_down';
    }
  }

  ngDoCheck() {
    let hours = 0;
    let resources = 0;

    this.venue?.shifts?.forEach((shift: any) => {
      resources += shift.tasks.length;
      hours += shift.tasks.length * shift.duration;
    });

    this.countHours = hours / 60;
    this.countResources = resources;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if(changes['venue']) {
  //     let hours = 0;
  //     let resources = 0;
  //     changes['venue'].currentValue.shifts.forEach((shift: any) => {
  //       resources += shift.tasks.length;
  //       hours += shift.tasks.length * shift.duration;
  //     });

  //     this.countHours = hours;
  //     this.countResources = resources;
  //   }
  // }

  toggleVenueContent(venue) {
    if (this.arrowIcon === 'arrow_drop_down') {
      this.arrowIcon = 'arrow_drop_up';
    } else {
      this.arrowIcon = 'arrow_drop_down';
    }
    this.toggleContent.emit(venue);
  }

  release() {
    this.releaseClicked.emit(this.venue);
  }
}
