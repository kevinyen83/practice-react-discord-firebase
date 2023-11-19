import { Component, Inject, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AccountService } from '../../../core/services/account/account.service';
import { UtilService } from 'app/core/services/utils/util.service';
import { VenuesService } from "../../../core/services/venues/venues.service";

@Component({
  selector: 'app-add-venue-manager',
  templateUrl: './add-venue-manager.component.html'
})
export class AddVenueManagerComponent implements OnInit {
  displayedColumns = [
    'name',
    'e-mail',
    'role',
    'department',
    'status'
  ];
  dataSource: MatTableDataSource<any>;
  currentAccount: any;
  venueClient;
  clients = [];
  managers = [];
  selectedMembers = [];
  selectedMemberIds = [];
  notification = '';
  unsubscribeAll = new Subject<any>();

  constructor(public utils: UtilService,
              private accountService: AccountService,
              private venuesService: VenuesService,
              private dialogRef: MatDialogRef<AddVenueManagerComponent>,
              @Inject(MAT_DIALOG_DATA) private data) {}

  ngOnInit(): void {
    console.log(this.data, 'ddd');
    this.venueClient = this.data.venueClient;
    this.managers = this.data.managers;
    this.accountService.currentAccount
      .pipe(
        takeUntil(this.unsubscribeAll),
        tap((res: any) => {
          this.currentAccount = res;
          this.clients = this.currentAccount?.clients;
          this.selectedMemberIds = this.venuesService.selectedMembersIds;
          let currClient = this.clients.find((cl) => cl.uuid === this.venueClient.uuid);
          let members = [];
          console.log(currClient, 'gggg');
          if (currClient) {
            members = [
              ...currClient.members.filter(m => m.status === 0)
            ];
            // if (currClient.managed) {
            //   members = [
            //     ...currClient.members,
            //     ...currClient.invitations
            //   ];
            // } else {
            //   members = [currClient.invitation];
            // }
          } else if (this.currentAccount.uuid === this.venueClient.uuid) {
            members = [...this.currentAccount.members.filter(m => m.status === 0)];
          } else {
            if (!members || !members.length) {
              this.notification = 'The Client has no Members yet';
            }
          }
          this.dataSource = new MatTableDataSource<any>(members);
        }),
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  changeSelect(e, member) {
    if (e.checked) {
      this.selectedMembers.push(member);
      this.venuesService.selectedMembersIds.push(member?.user_id);
    } else {
      this.selectedMembers = this.selectedMembers.filter(m => m.user_id !== member.user_id);
      this.venuesService.selectedMembersIds = this.venuesService.selectedMembersIds.filter(id => id !== member.user_id);
    }
  }

  cancelSelect() {
    this.dialogRef.close();
  }

  select() {
    this.dialogRef.close(this.selectedMembers);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
