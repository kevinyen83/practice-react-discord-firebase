import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resource-interviews',
  templateUrl: './resource-interviews.component.html'
})
export class ResourceInterviewsComponent implements OnInit {

  @Input() interviews;
  @Input() status;

  constructor() { }

  ngOnInit(): void {
  }

}
