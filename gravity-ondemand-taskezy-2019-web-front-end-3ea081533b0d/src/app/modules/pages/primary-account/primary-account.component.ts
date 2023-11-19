import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { tap } from 'rxjs';

import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-primary-account',
  templateUrl: './primary-account.component.html'
})
export class PrimaryAccountComponent implements OnInit {
  // viewWelcome: boolean = true;
  // detailedInformation;
  viewAccountInformation: boolean = true;
  viewAutorityVerification: boolean = false;
  viewVerifyingNow: boolean = false;
  viewCompleteAccount: boolean = false;
  // currentEvent: any;
  currentUser;

  abnInfo;

  constructor(private accountService: AccountService,
              private userProfileService: UserProfileService,
              public router: Router) {}

  ngOnInit(): void {
    // this.accountService.detailedInformation.subscribe((res) => {
    //   this.detailedInformation = res;
    // });
    this.userProfileService.currentUser
      .pipe(
        tap((res) => {
          this.currentUser = res;
        })
      )
      .subscribe();
  }

  setAbnInfo(e) {
    this.abnInfo = e;
  }

  back() {
    // this.accountService.detailedInformation = false;
    this.router.navigate(['/welcome']);
  }

  goToNextPage(event) {
    if (event === 'authority-verification') {
      this.viewAutorityVerification = true;
      this.viewAccountInformation = false;
      this.viewVerifyingNow = false;
    } else if (event === 'verifying-now') {
      this.viewAutorityVerification = false;
      this.viewAccountInformation = false;
      this.viewVerifyingNow = true;
    }
  }

  reset() {
    this.viewAutorityVerification = false;
    this.viewAccountInformation = true;
    this.viewVerifyingNow = false;
    // this.accountService.detailedInformation = false;
  }
}
