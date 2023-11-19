import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { AccountService } from "app/core/services/account/account.service";

const avatarURL =
  "https://lh3.googleusercontent.com/proxy/lOTJwhDpwKV5vVEuGPWjK6LXGdDsGX6Z1vYi4JnXL-wOu2Z7GwVygOxhQRXnNuL_16GGJu1ACmvFglQ";
@Component({
  selector: "app-shift-activity",
  templateUrl: "./shift-activity.component.html",
})
export class ShiftActivityComponent implements OnInit {
  constructor(
    private router: Router,
    public accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShiftActivityComponent>
  ) {
    this.handleCheckActivity(data);
  }

  handleCheckActivity(data) {
    let activity = [],
      activityByDate = [];
    if (data && data.length > 0) {
      for (const shiftItem of data) {
        if (shiftItem.resource.status === 1) {
          if (this.isEmpty(shiftItem.timesheet.signoff.signature)) {
            activity.push({
              avatar: shiftItem.resource.avatar || avatarURL,
              name: shiftItem.resource.profile_name,
              activity: "completed the shift.",
              date: moment(shiftItem.timesheet.signoff.datetime).format(
                "YYYY-MM-DD HH:mm"
              ),
              sortableDate: moment(shiftItem.timesheet.signoff.datetime).format(
                "YYYY-MM-DD"
              ),
            });
          }

          if (this.isEmpty(shiftItem.timesheet.signon.signature)) {
            activity.push({
              avatar: shiftItem.resource.avatar || avatarURL,
              name: shiftItem.resource.profile_name,
              activity: "signed on.",
              date: moment(shiftItem.timesheet.signon.datetime).format(
                "YYYY-MM-DD HH:mm"
              ),
              sortableDate: moment(shiftItem.timesheet.signon.datetime).format(
                "YYYY-MM-DD"
              ),
            });
          }

          if (
            shiftItem.timesheet.breaks &&
            shiftItem.timesheet.breaks.length > 0
          ) {
            for (const breakItem of shiftItem.timesheet.breaks) {
              activity.push({
                avatar: shiftItem.resource.avatar || avatarURL,
                name: shiftItem.resource.profile_name,
                activity: `had ${breakItem.duration}m break.`,
                date: moment(breakItem.datetime).format("YYYY-MM-DD HH:mm"),
                sortableDate: moment(breakItem.datetime).format("YYYY-MM-DD"),
              });
            }
          }
        }
      }

      activity.sort((itemA, itemB) => {
        if (itemA.date < itemB.date) {
          return 1;
        } else {
          return -1;
        }
      });

      const stats = {};

      for (const activityItem of activity) {
        if (stats[activityItem.sortableDate]) {
          stats[activityItem.sortableDate].push(activityItem);
        } else {
          stats[activityItem.sortableDate] = [activityItem];
        }
      }

      for (const statsItem of Object.entries(stats)) {
        activityByDate.push({
          date:
            moment().format("YYYY-MM-DD") === statsItem[0]
              ? "Today"
              : statsItem[0],
          activityData: statsItem[1],
        });
      }
    }

    this.activityData = activityByDate;
  }

  isEmpty(data) {
    if (data === null || data === undefined || data === "") {
      return false;
    } else {
      return true;
    }
  }

  activityData = [];

  ngOnInit() {
    // this.activityData = activityMock;
  }

  handleModalClose() {
    this.dialogRef.close();
  }
}
