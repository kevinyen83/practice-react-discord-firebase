import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { catchError, finalize, takeUntil } from "rxjs/operators";
import { EMPTY, Subject } from "rxjs";

import { fuseAnimations } from "@fuse/animations";
import { ForgotPasswordService } from "app/core/services/auth/forgot-password/forgot-password.service";
import { FuseAlertType } from "@fuse/components/alert";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  unsubscribeAll = new Subject();
  forgotPasswordForm: FormGroup;
  errorMessage;
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  sendSuccess = false;
  sending = false;


  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  forgotPassword(forgotPasswordForm): void {
    const user = {
      loginId: forgotPasswordForm.value.email,
    };

    this.sending = true;
    this.showAlert = false;
    this.forgotPasswordService
      .forgotPassword(user)
      .pipe(
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          this.sending = false;
          // Set the alert
          if (err && err.status === 404) {
            this.alert = {
              type: "success",
              message: "If your email exists on the system, we have sent an email with instructions to reset your password",
            };
          } else {
            this.alert = {
              type: "error",
              message: `Forgot Password Failed. [${err.status}]`,
            };
          }
          return EMPTY;
        }),
        finalize(() => {
          this.sending = false;
          // Show the alert
          this.showAlert = true;
        })
      )
      .subscribe((res) => {
          this.alert = {
            type: "success",
            message: "If your email exists on the system, we have sent an email with instructions to reset your password",
          };
        });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  private buildForm(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
}
