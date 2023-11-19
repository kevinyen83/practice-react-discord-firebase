import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { EMPTY, Subject } from 'rxjs';

import { ResetPasswordService } from 'app/core/services/auth/reset-password/reset-password.service';
import { FuseAlertType } from '@fuse/components/alert';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

  resetPasswordForm: FormGroup;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  token = '';
  resetComplete = false;

  // Private
  private unsubscribeAll: Subject<any>;

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private resetPasswordService: ResetPasswordService) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    this.buildForm();
  }

  buildForm(): void {
    this.resetPasswordForm = this._formBuilder.group({
      password: [
        '',
        [Validators.required, Validators.minLength(8)]
      ]
    });
  }

  resetPassword(): void {
    // Return if the form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // Disable the form
    this.resetPasswordForm.disable();

    // Hide the alert
    this.showAlert = false;

    const newPasswordData = {
      token: this.token,
      password: this.resetPasswordForm.value.password
    };

    this.resetPasswordService
      .resetPasswordForgot(newPasswordData)
      .pipe(
        catchError((err) => {
          this.alert = {
            type: 'error',
            message: `Password Reset Failed. [${err.status}]`
          };
          return EMPTY;
        }),
        // takeUntil(this.unsubscribeAll),
        finalize(() => {
          // Re-enable the form
          this.resetPasswordForm.enable();

          // Reset the form
          this.resetPasswordNgForm.resetForm();

          // Show the alert
          this.showAlert = true;
        })
      )
      .subscribe((sub) => {
        this.alert = {
          type: 'success',
          message: 'Your password has been reset. Return to the login page and Sign In with your new details.'
        };
        // setTimeout(() => {
        //   this.router.navigate(['auth/login']);
        // }, 1000);
        this.resetComplete = true;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
