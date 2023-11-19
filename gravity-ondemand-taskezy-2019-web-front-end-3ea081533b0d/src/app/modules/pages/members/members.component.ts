import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { Subject, switchMap, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/services/account/account.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { InviteMembersFormArrayComponent } from 'app/modules/common/invite-members-form-array/invite-members-form-array.component';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  animations: fuseAnimations
})
export class MembersComponent implements OnInit {
  membersDataSource: MatTableDataSource<any>;
  addMembersForm: FormGroup = new FormGroup({});
  currentMember;
  viewMember = false;
  currentAccount;
  membersDisplayedColumns = [
    'pic',
    'name',
    'email',
    'phone',
    'department',
    'status',
    'controls'
  ];

  status = [
    'Pending',
    'Active'
  ];

  members = [];
  invites = [];
  invitedMembers = [];
  defaultAvatar;

  @ViewChild('matDrawerShowMember') matDrawerShowMember: MatDrawer;
  @ViewChild(InviteMembersFormArrayComponent) inviteList: InviteMembersFormArrayComponent;

  private unsubscribeAll = new Subject();

  constructor(private avatarService: AvatarService, private accountService: AccountService, public utils: UtilService) {
    this.defaultAvatar = this.avatarService.defaultAvatar;
  }

  ngOnInit(): void {
    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          this.currentAccount = res;
          this.members = this.currentAccount.members || [];
          this.invites = this.currentAccount.invitations || [];
          let currentMembers = [
            ...this.members,
            ...this.invites.filter((inv) => inv.status !== 1)];
          this.membersDataSource = new MatTableDataSource<any>(currentMembers);
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  sortData(event) {}

  addInvite() {
    this.inviteList.addInvite();
    // ++this.membersService.countInvite;
    // this.membersService.invitedMembers.next(this.membersService.countInvite);
  }

  resendInvite(invite) {
    this.accountService
      .deleteInviteUserToAccount(invite.account_uuid, invite.email)
      .pipe(
        switchMap(() =>
          this.accountService.inviteUserToAccount(invite.account_uuid, invite.email, {
            name: invite.name,
            role: invite.role,
            message: `Hi, Come and join us at ${invite.account_name}`,
            department: invite.department
          })
        ),
        switchMap(() => {
          return this.accountService.setCurrentAccount(this.currentAccount.uuid);
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  cancelInvite(invite) {
    this.accountService
      .deleteInviteUserToAccount(invite.account_uuid, invite.email)
      .pipe(
        switchMap(() => {
          return this.accountService.setCurrentAccount(this.currentAccount.uuid);
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  showMember(row) {
    if (!row.date_invited) {
      this.currentMember = row;
      this.viewMember = true;
      this.matDrawerShowMember.toggle();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
