import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import * as moment from 'moment';

import { RefreshService } from './core/services/auth/refresh/refresh.service';
import { environment } from '../environments/environment';
import { Intercom } from 'ng-intercom';
import { Router } from '@angular/router';
import { UtilService } from './core/services/utils/util.service';
import { MatIconRegistry } from '@angular/material/icon';
import { AccountService } from './core/services/account/account.service';

const INTERVAL_TIME = 20000;

moment.updateLocale(moment.locale(), {
  week: {
    dow: 1,
    doy: 4
  }
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  fuseConfig: any;
  syncInterval;

  constructor(private refreshService: RefreshService, private accountService: AccountService, public intercom: Intercom, private iconRegistry: MatIconRegistry, public router: Router, private readonly location: Location, private utils: UtilService) {
    // iconRegistry.registerFontClassAlias('icomoon', 'taskezyIconFont');

    if (environment.production) {
      window.console.log = () => {};
      window.console.warn = () => {};
      window.console.error = () => {};
      window.console.time = () => {};
      window.console.timeEnd = () => {};
    }

  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    if (!this.location.path().includes('/auth/verify-email')) {
      this.refreshService.loginWithRefresh();
    }
    this.utils.getVersionOfApp();
    // console.log("a change that doesnt matter to rerun the pipelines.");
    if(!environment.e2e) {
      this.intercom.boot({
        app_id: environment.intercomAPIKey,
        widget: {
          activator: '#intercom'
        },
        version: this.utils.versionOfApp
      });
    }
  }

  ngAfterViewInit()	{
    this.syncInterval = setInterval(() => {
      this.syncRefresh()
    }, INTERVAL_TIME)
  }

  syncRefresh() {
    if(this.location.path().includes('/pages')) {
      this.accountService.regularRefreshCurrentAccount()
    }
  }

  ngOnDestroy()	{
    clearInterval(this.syncInterval)
  }
}
