import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { EMPTY, Subject, timer } from 'rxjs';

import { MobileVerificationService } from 'app/core/services/auth/mobile-verification/mobile-verification.service';
import { FuseAlertType } from '@fuse/components/alert';
import { catchError, finalize, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { LoginService } from 'app/core/services/auth/login/login.service';
import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';

@Component({
  selector: 'app-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MobileVerificationComponent implements OnInit, OnDestroy {
  @ViewChild('mobileVerificationNgForm') mobileVerificationNgForm: NgForm;

  mobileVerificationForm: FormGroup;
  isMobileVerified: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  time = 120;
  notification: string = 'Mobile verification code will be sent to:';
  timerView: boolean = false;
  showAlert: boolean = false;
  token = '';
  sendText = 'Send';
  last3 = 'xxx';
  authTokenData;
  viewSpinner = false;
  time$ = new Subject<string>();
  timer$ = timer(0, 1000).pipe(
    map((i) => {
      return this.time - i;
    }),
    take(this.time + 1),
    finalize(() => (this.timerView = false))
  );
  // Private
  private reset$ = new Subject();
  private unsubscribeAll: Subject<any>;

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private mobileVerificationService: MobileVerificationService, private loginService: LoginService, private refreshService: RefreshService) {
    // Set the private defaults
    // this.isMobileVerified = true;
    this.unsubscribeAll = new Subject();
    this.loginService.tokenData
      .pipe(
        takeUntil(this.unsubscribeAll),
        tap((res) => {
          if (res) {
            this.authTokenData = res;
            // this.last3 = this.authTokenData.mobile.slice(-3);
          }
        }),
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.buildForm();
    this.mobileVerificationService.isSendCode.subscribe((res) => {
      this.isMobileVerified = res;
      this.timerView = this.isMobileVerified;
      if(res == false){
        this.notification = 'Mobile verification code will be sent to:';
      }
    });
    this.mobileVerificationForm.get('mobileNumber').patchValue(this.authTokenData.mobile);
  }

  buildForm(): void {
    this.mobileVerificationForm = this._formBuilder.group({
      mobileNumber: [
        '',
        [Validators.required]
      ],
      token: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}$/)]
      ]
    });
  }

  verifyMobile(): void {

    // Disable the form
    this.mobileVerificationForm.disable();

    // Hide the alert
    this.showAlert = false;

    const token = 'T-' + this.mobileVerificationForm.value.token;

    this.mobileVerificationService
      .verifyMobile(token)
      .pipe(
        tap((sub) => {
          this.isMobileVerified = true;
          this.alert = {
            type: 'success',
            message: 'Mobile Verified successfully.'
          };
          setTimeout(() => {
            this.refreshService.refreshWithRefreshToken().subscribe();
          }, 3000);
        }),
        catchError((err) => {
          this.alert = {
            type: 'error',
            message: 'Verification Failed'
          };
          // 208 Already Verified ? does this error?
          // 404 not found
          // 409 mismatch code
          return EMPTY;
        }),
        // takeUntil(this.unsubscribeAll),
        finalize(() => {
          // Re-enable the form
          this.mobileVerificationForm.enable();
          this.mobileVerificationNgForm.resetForm();

          // Show the alert
          this.showAlert = true;
          // Reset the form
        })
      )
      .subscribe();
  }

  resendVerifySMS(): void {
    // Hide the alert
    this.viewSpinner = true;
    this.showAlert = false;
    this.sendText = 'Resend';
    const mobile = {
      mobile: this.mobileVerificationForm.get('mobileNumber').value
    };

    if (this.authTokenData.mobile !== this.mobileVerificationForm.get('mobileNumber').value) {
      this.mobileVerificationService
        .saveNewNumber(mobile.mobile)
        .pipe(
          switchMap((res) => {
            return this.mobileVerificationService.resendVerifyMobile(mobile.mobile);
          }),
          catchError((err) => {
            this.alert = {
              type: 'error',
              message: 'Resend Verification SMS Failed'
            };
            this.viewSpinner = false;
            return EMPTY;
          }),
          // takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.showAlert = true;
            this.viewSpinner = false;
          })
        )
        .subscribe((sub) => {
          this.alert = {
            type: 'success',
            message: 'Verification SMS Sent'
          };
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
          this.timerView = true;
          this.initTimer();
          this.mobileVerificationService.isSendCode = true;
          this.isMobileVerified = true;
          this.notification = `Please enter code sent to ${mobile.mobile}`;
        });
    } else {
      this.mobileVerificationService
        .resendVerifyMobile(mobile.mobile)
        .pipe(
          catchError((err) => {
            this.alert = {
              type: 'error',
              message: 'Resend Verification SMS Failed'
            };
            this.viewSpinner = false;
            return EMPTY;
          }),
          // takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.showAlert = true;
            this.viewSpinner = false;
          })
        )
        .subscribe((sub) => {
          this.alert = {
            type: 'success',
            message: 'Verification SMS Sent'
          };
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
          this.timerView = true;
          this.initTimer();
          this.mobileVerificationService.isSendCode = true;
          this.isMobileVerified = true;
          this.notification = `Please enter code sent to ${mobile.mobile}`;
        });
    }
  }

  signOut() {
    this.loginService.signOut();
  }

  initTimer() {
    this.reset$
      .pipe(
        startWith(void 0),
        switchMap(() => this.timer$)
        // takeUntil(this.unsubscribeAll),
      )
      .subscribe((seconds) => {
        let minutes = Math.floor(seconds / 60);
        let second;
        let sec = seconds - minutes * 60;
        second = sec;
        if (sec < 10) {
          second = '0' + sec;
        }

        let time = minutes + ':' + second;
        this.time$.next(time);
      });
  }

  // refresh() {
  //   this.reset$.next(void 0);
  // }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
