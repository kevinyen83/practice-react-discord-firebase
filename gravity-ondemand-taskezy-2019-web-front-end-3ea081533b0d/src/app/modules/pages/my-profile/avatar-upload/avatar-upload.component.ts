import {Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, AfterViewInit} from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { MatDialog } from "@angular/material/dialog";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AvatarUploadComponent implements OnInit, AfterViewInit {

  @Input() set currentUser(value) {
    if (value) {
      this._currentUser = value;
      this.currentAvatar = this._currentUser['imageUrl'];
    }
  };
  @Output() uploadSuccess = new EventEmitter<any>();

  _currentUser;
  currentAvatar = null;
  defaultAvatar = '';

  constructor(private avatarService: AvatarService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.defaultAvatar = this.avatarService.defaultAvatar;
  }

  ngAfterViewInit() {
  }

  editProfile() {
    let dialog = this.dialog.open(EditProfileComponent, {
      width: '500px',
      data: this._currentUser
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.uploadSuccess.emit(res);
      }
    })
  }

}
