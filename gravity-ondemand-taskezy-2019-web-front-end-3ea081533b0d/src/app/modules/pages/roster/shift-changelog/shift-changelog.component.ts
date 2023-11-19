import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { EMPTY } from "rxjs";

import { catchError, tap } from "rxjs/operators";

import { RosterService } from "../../../../core/services/roster/roster.service";

@Component({
  selector: "app-shift-changelog",
  templateUrl: "./shift-changelog.component.html",
})
export class ShiftChangelogComponent implements OnInit {
  currentShift;
  @Output() closeSideBar = new EventEmitter<any>();

  constructor(private rosterService: RosterService) {}

  ngOnInit(): void {
    this.rosterService.currentShift
      .pipe(
        tap((res) => {
          this.currentShift = res;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  close() {
    this.closeSideBar.emit("changelog");
  }
}
