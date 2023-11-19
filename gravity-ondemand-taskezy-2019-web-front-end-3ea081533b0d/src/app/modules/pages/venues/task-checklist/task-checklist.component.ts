import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-task-checklist',
  templateUrl: './task-checklist.component.html'
})
export class TaskChecklistComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

}
