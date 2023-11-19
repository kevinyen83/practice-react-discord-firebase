import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from "@angular/core";

import { fuseAnimations } from "@fuse/animations";

import { AccountService } from "../../../core/services/account/account.service";
import { MobileVerificationService } from "../../../core/services/auth/mobile-verification/mobile-verification.service";

  @Component({
    selector: "app-auth-layout",
    templateUrl: "./auth-layout.component.html",
    animations: fuseAnimations
  })
  export class AuthLayoutComponent implements OnInit {
    isSendMobileCode;

    @Input() name;
    @Input() status;
    @Input() hasInvites;
    @Input() noSplit = false;
    @Input() showHeader = false;
    @Input() showBack = false;
    @Input() showTitle = true;
    @Input() circles = true;
    @Input() asResource;
    @Input() headerName;
    @Output() toBack = new EventEmitter<any>();

    constructor(private accountService: AccountService,
                private mobileVerificationService: MobileVerificationService) {}

    ngOnInit(): void {
      this.mobileVerificationService.isSendCode.subscribe(res => {
        this.isSendMobileCode = res;
      });
    }

    toBackCall() {
      if (this.status === 'verify-mobile') {
        this.mobileVerificationService.isSendCode = false;
      } else {
        this.toBack.emit();
      }
    }

  }
