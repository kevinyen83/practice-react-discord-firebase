import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { fuseAnimations } from '@fuse/animations';
import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';
import { UtilService } from 'app/core/services/utils/util.service';
import { PrivacyPolicyComponent } from 'app/modules/common/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from 'app/modules/common/terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-auth-footer',
  templateUrl: './auth-footer.component.html',
  animations: fuseAnimations
})
export class AuthFooterComponent implements OnInit {
  version: string;

  constructor(private utils: UtilService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.version = this.utils.versionOfApp;
  }

  openModal(name, e?) {
    //open the policy type based on name in modal to be read and closed.
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    let dialogOpts = new MatDialogConfig();
    dialogOpts.width = '65%';
    dialogOpts.maxHeight = '90vh';

    if (name === 'privacy_policy') {
      const dialog = this.dialog.open(PrivacyPolicyComponent, dialogOpts);
    } else if (name === 'terms_conditions') {
      const dialog = this.dialog.open(TermsConditionsComponent, dialogOpts);
    }
  }
}
