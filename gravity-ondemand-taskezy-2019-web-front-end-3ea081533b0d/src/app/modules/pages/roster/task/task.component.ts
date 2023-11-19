import { Component, Input, OnInit } from '@angular/core';

import { finalize, tap } from "rxjs/operators";
import moment from "moment";

import { RosterService } from "../../../../core/services/roster/roster.service";
import { AccountService } from "../../../../core/services/account/account.service";
import { FuseAlertType } from "../../../../../@fuse/components/alert";
import { AvatarService } from "../../../../core/services/avatar/avatar.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {

  @Input() task;
  @Input() currentAccount;
  @Input() currentShift;

  showAlert = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  shiftInPast = false;
  defaultAvatar;

  constructor(private rosterService: RosterService,
              private accountService: AccountService,
              private avatarService: AvatarService) { }

  ngOnInit(): void {
    this.shiftInPast = moment(this.currentShift?.datetime).isBefore(moment());
    this.defaultAvatar = this.avatarService.defaultAvatar;
  }

  acceptTask(task) {
    this.changeStatusSupplier(task, 2);
  }

  declineTask(task) {
    this.changeStatusSupplier(task, 3);
  }

  changeStatusSupplier(task, status) {
    this.rosterService.changeStatusSupplier(this.currentAccount.uuid, task, status, this.currentShift).pipe(
      tap(res => {
        if (status === 2) {
          this.getAlert('Task was successfully accepted');
        } else if (status === 3) {
          this.getAlert('Task was successfully declined');
        }
      }),
      finalize(() => {
        this.accountService.setCurrentAccount(this.currentAccount.uuid);
      })
    ).subscribe();
  }

  getAlert(message) {
    this.alert.message = message;
    this.showAlert = true
    setTimeout(() => {
      this.showAlert = false;
    }, 3000)
  }

  getStatusColor(status, user) {
    this.rosterService.getStatusColor(status, user);
  }

  getStatus(status, user) {
    this.rosterService.getStatus(status, user);
  }

}
