import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, takeUntil } from 'rxjs/operators';
import {tap, combineLatest, Subject, EMPTY, switchMap} from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';

import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';
import { AvatarService } from '../../../../../core/services/avatar/avatar.service';
import { UtilService } from 'app/core/services/utils/util.service';
import { VenuesService } from 'app/core/services/venues/venues.service';
const VIEW_MODE_REPLACE_ADMINSTRATOR = 'VIEW_MODE_REPLACE_ADMINSTRATOR';
const VIEW_MODE_ADD_ACCREDITATION = 'VIEW_MODE_ADD_ACCREDITATION';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ViewClientComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawerReplaceAdmin') matDrawerReplaceAdmin;
  status = '';
  showAlert: boolean;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  defaultAvatar;
  currentAvatar;
  clients = [];
  unsubscribeAll = new Subject<any>();
  selectedAccount: any = null;
  currentAccount: any = {};
  pageTitle = '';
  viewMode = VIEW_MODE_REPLACE_ADMINSTRATOR
  selectedUUID;
  currentTab
  userType = 'client'

  constructor(private router: Router, public accountService: AccountService, private avatarService: AvatarService, public utils: UtilService, private route: ActivatedRoute,
    private venuesService: VenuesService) {
  }

  ngOnInit() {

    this.venuesService.currentTab.subscribe(res => {
      this.currentTab = res
      })


    this.defaultAvatar = this.avatarService.defaultAvatar;
    let params;
    combineLatest([
      this.accountService.currentAccount,
      this.route.params
    ])
      .pipe(
        tap((res: any) => {
          this.currentAccount = res[0];
          params = res[1];
          console.log("params ---", res[1])
          this.selectedUUID = params['id'];

          if (this.currentAccount.clients) {
            this.clients = this.currentAccount.clients;
          } else {
            this.clients = [];
          }
          if (this.currentAccount.uuid) {
            this.status = 'edit';
            this.selectedAccount = this.clients.find((cli) => cli.uuid === params['id']);
            this.accountService.selectedAccountStatus = this.status;
            this.accountService.selectedAccount = this.selectedAccount;
            this.pageTitle = this.selectedAccount?.detail?.name;
            this.currentAvatar = this.selectedAccount?.detail?.logo;
            // if (!this.selectedAccount.status) {
            //   this.selectedAccount.status = 0;
            // }
          }
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  backListSuppliers() {
    this.router.navigate(['pages/list-suppliers']);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  handleAddAccreditation() {
    this.viewMode = VIEW_MODE_ADD_ACCREDITATION
    this.matDrawerReplaceAdmin.toggle()
  }

  handleBackPrev() {
    this.viewMode = VIEW_MODE_REPLACE_ADMINSTRATOR
    this.matDrawerReplaceAdmin.toggle()
  }

  closeSideNav() {
    this.matDrawerReplaceAdmin.toggle()

    const selectedAccountData = this.accountService.selectedAccount._value

    this.accountService._selectedAccount.next({...selectedAccountData});
  }
}
