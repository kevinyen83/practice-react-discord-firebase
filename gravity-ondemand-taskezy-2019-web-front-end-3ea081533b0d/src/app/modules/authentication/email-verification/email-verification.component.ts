import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { delay, EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';

import { EmailVerificationService } from 'app/core/services/auth/email-verification/email-verification.service';
import { FuseAlertType } from '@fuse/components/alert';
import { LoginService } from 'app/core/services/auth/login/login.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  // @ViewChild("emailVerificationNgForm") emailVerificationNgForm: NgForm;

  emailVerificationForm: FormGroup;
  isEmailVerified: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  verificationToken = '';
  authTokenData;

  // Private
  private unsubscribeAll: Subject<any>;

  constructor(private _formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private emailVerificationService: EmailVerificationService, private loginService: LoginService) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
    this.loginService.tokenData
      .pipe(
        takeUntil(this.unsubscribeAll),
        tap((res) => {
          this.authTokenData = res;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.verificationToken = this.route.snapshot.paramMap.get('token');
    this.buildForm();
    if (this.verificationToken) {
      this.verifyEmail();
    } else {
      // this.alert = {
      //   type: "error",
      //   message: "Missing Verification Code",
      // };
      // this.showAlert = true;
    }
  }

  buildForm(): void {
    this.emailVerificationForm = this._formBuilder.group({
      token: [
        this.verificationToken ? this.verificationToken : '',
        [Validators.required]
      ]
    });
  }

  verifyEmail(): void {
    // Return if the form is invalid
    if (this.emailVerificationForm.invalid) {
      return;
    }

    // Disable the form
    this.emailVerificationForm.disable();

    // Hide the alert
    this.showAlert = false;

    const token = this.emailVerificationForm.value.token;

    this.emailVerificationService
      .verifyEmail(token)
      .pipe(
        tap((sub) => {
          this.isEmailVerified = true;
          this.alert = {
            type: 'success',
            message: 'Email verified successfully'
          };
        }),
        catchError((err) => {
          this.alert = {
            type: 'error',
            message: 'Verification Failed'
          };
          //404 code invalid or expired
          return EMPTY;
        }),
        // takeUntil(this.unsubscribeAll),
        finalize(() => {
          // Re-enable the form
          this.emailVerificationForm.enable();
          this.showAlert = true;
          // Reset the form
          // this.emailVerificationNgForm.resetForm();
        }),
        delay(3000)
      )
      .subscribe((res) => this.router.navigate(['/auth/login']));
  }

  resendVerifyEmail(): void {
    // Hide the alert
    this.showAlert = false;

    // console.log(resendVerificationForm);
    // const email = {
    //   email: this.authTokenData.email,
    // };
    this.emailVerificationService
      .resendVerifyEmail(this.authTokenData.email)
      .pipe(
        catchError((err) => {
          this.alert = {
            type: 'error',
            message: 'Resend Verification Email Failed'
          };
          return EMPTY;
        }),
        // takeUntil(this.unsubscribeAll),
        finalize(() => {
          // Show the alert
          this.showAlert = true;
        })
      )
      .subscribe((sub) => {
        this.alert = {
          type: 'success',
          message: 'New Verification Email Sent, Please check your emails.'
        };
      });
  }

  signOut() {
    this.loginService.signOut();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
