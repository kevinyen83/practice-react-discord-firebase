import { RefreshService } from 'app/core/services/auth/refresh/refresh.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { EMPTY, Subject } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

import { LoginService } from 'app/core/services/auth/login/login.service';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('signInNgForm') signInNgForm: NgForm;

  unsubscribeAll = new Subject();

  version: string;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  signInForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private loginService: LoginService, private utils: UtilService) {}

  ngOnInit() {
    this.version = this.utils.versionOfApp;
    this.buildForm();
    if (localStorage.getItem('email') && localStorage.getItem('rememberMe')) {
      this.signInForm.get('email').patchValue(localStorage.getItem('email'));
      this.signInForm.get('rememberMe').patchValue(localStorage.getItem('rememberMe'));
    }
  }

  buildForm(): void {
    this.signInForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    if (this.signInForm.get('rememberMe').value) {
      this.loginService.setRememberMe(true, this.signInForm.get('email').value);
    } else {
      this.loginService.setRememberMe(false);
    }

    const user = {
      loginId: this.signInForm.get('email').value,
      password: this.signInForm.get('password').value
    };

    this.loginService
      .signIn(user)
      .pipe(
        tap((res) => {
          this.alert = {
            type: 'success',
            message: 'Welcome'
          };
        }),
        catchError((error) => {
          let message = '';
          if (error.status == 404) {
            message = 'Email or Password is invalid.';
          } else if(error.status === 423 && !error?.error?.user?.active) {
            message = 'This account is locked. If you want to unlock it, please contact support@taskezy.com.'
          } else {
            message = 'There was an error.';
          }
          this.alert = {
            type: 'error',
            message: message
          };
          //
          return EMPTY;
        }),
        finalize(() => {
          // Show the alert
          this.showAlert = true;
          this.signInForm.enable();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
