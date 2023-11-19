import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-day-template',
  templateUrl: './event-day-template.component.html'
})
export class EventDayTemplateComponent implements OnInit {

  @Input() itemMeta: any;

  constructor() { }

  ngOnInit(): void {
  }

}
