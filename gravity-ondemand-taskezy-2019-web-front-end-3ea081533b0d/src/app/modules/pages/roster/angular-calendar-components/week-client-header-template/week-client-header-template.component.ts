import { Component, OnInit, Output, EventEmitter, Input, DoCheck } from '@angular/core';

import { AvatarService } from 'app/core/services/avatar/avatar.service';

@Component({
  selector: 'app-week-client-header-template',
  templateUrl: './week-client-header-template.component.html'
})
export class WeekClientHeaderTemplateComponent implements OnInit, DoCheck {
  arrowIcon: string = 'arrow_drop_down';
  avatar;

  countVenues = 0;
  countResources = 0;
  countHours = 0;

  @Input() dayHeaderClicked;
  @Input() days;
  @Input() showDays = true;
  @Input() client;
  @Input() locale;
  @Input() eventDropped;
  @Input() trackByWeekDayHeaderDate;
  @Input() dragEnter;
  @Input() index: number;
  @Input() openedClients;
  @Input() openedVenues;
  @Input() releaseDisabled = false;

  @Output() rightClicked = new EventEmitter<any>();
  @Output() toggleContent = new EventEmitter<any>();
  @Output() releaseClicked = new EventEmitter<any>();

  constructor(private avatarService: AvatarService) {}

  ngOnInit(): void {
    this.avatar = this.avatarService.defaultAvatar;
    if (this.client && this.client?.detail?.logo && this.client?.detail?.logo !== '') {
      this.avatar = this.client.detail.logo;
    }
    if (this.openedClients?.includes(this.client.uuid)) {
      this.arrowIcon = 'arrow_drop_up';
    } else {
      this.arrowIcon = 'arrow_drop_down';
    }
  }

  ngDoCheck() {
    let hours = 0;
    let resources = 0;
    this.countVenues = this.client?.venues?.length;

    if (this.client?.venues.length) {
      this.client?.shifts?.forEach((shift: any) => {
        resources += shift.tasks.length;
        hours += shift.tasks.length * shift.duration;
      });
    }

    this.countHours = hours / 60;
    this.countResources = resources;
  }

  toggleClientContent(client) {
    if (this.arrowIcon === 'arrow_drop_down') {
      this.arrowIcon = 'arrow_drop_up';
    } else {
      this.arrowIcon = 'arrow_drop_down';
    }
    this.toggleContent.emit(client);
  }

  rightClick(event, day) {
    event.preventDefault();
    this.rightClicked.emit(day);
  }

  release() {
    this.releaseClicked.emit(this.client);
  }
}
