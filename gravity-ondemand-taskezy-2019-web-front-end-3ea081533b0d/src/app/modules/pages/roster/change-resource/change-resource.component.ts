import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RosterService } from "../../../../core/services/roster/roster.service";

@Component({
  selector: 'app-change-resource',
  templateUrl: './change-resource.component.html'
})
export class ChangeResourceComponent implements OnInit {
  selectedResource;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private rosterService: RosterService) { }

  ngOnInit(): void {
  }

  saveResource() {
    if (this.selectedResource) {
      this.rosterService.updateTaskWithTheSpecificResource(this.data?.task, this.selectedResource?.resource).subscribe(res => {
        debugger;
      });
    }
  }

  selectResource(inx) {
    this.selectedResource = this.data?.resources[inx];
  }

}
