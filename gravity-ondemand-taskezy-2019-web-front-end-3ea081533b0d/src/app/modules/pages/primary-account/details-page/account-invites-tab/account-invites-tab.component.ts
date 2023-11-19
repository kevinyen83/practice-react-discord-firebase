import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from "../../../../../core/services/account/account.service";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-account-invites-tab',
  templateUrl: './account-invites-tab.component.html'
})
export class AccountInvitesTabComponent implements OnInit {
  @Input() invitations;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  acceptInvite(invite) {
    this.accountService.acceptInviteForAccount(invite.uuid).pipe(
      tap(res => {
        this.updateInvitations(invite);
      })
    ).subscribe();
  }

  declineInvite(invite) {
    this.accountService.declineInviteForAccount(invite.uuid).pipe(
      tap(res => {
        this.updateInvitations(invite);
      })
    ).subscribe();
  }

  updateInvitations(invite) {
    this.invitations = this.invitations.filter(inv => inv.uuid !== invite.uuid);
  }

}
