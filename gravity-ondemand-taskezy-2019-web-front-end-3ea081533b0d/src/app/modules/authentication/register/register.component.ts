import {
  Component, ElementRef, NgZone,
  OnDestroy,
  OnInit, ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import { fuseAnimations } from "@fuse/animations";
import { catchError, finalize, takeUntil, tap } from "rxjs/operators";
import { EMPTY, Subject } from "rxjs";
import * as moment from "moment";

import { RegisterService } from "app/core/services/auth/register/register.service";
import { FuseAlertType } from "@fuse/components/alert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PrivacyPolicyComponent } from "app/modules/common/privacy-policy/privacy-policy.component";
import { TermsConditionsComponent } from "app/modules/common/terms-conditions/terms-conditions.component";
import { LoginService } from "app/core/services/auth/login/login.service";
import { subYears } from "date-fns";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RegisterComponent implements OnInit, OnDestroy {


  nameOfHeader = 'Registration';
  unsubscribeAll = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;
  checked;
  registerForm: FormGroup;
  hideForm = false;
  maxDate = subYears(new Date(), 18)

  constructor(
    private ngZone: NgZone,
    private registerService: RegisterService,
    private loginService: LoginService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.registerService.getRegisterData();
    this.buildForm();
  }



  changeCheckbox() {
    console.log("clicked");
  }

  buildForm(): void {
    this.registerForm = this._formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      mobilePhone: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]],
      accept: [false, [Validators.requiredTrue]],
    });
  }

  registerUser(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.showAlert = false;
    if (this.registerForm.valid) {
      const user = {
        password: this.registerForm.get("password").value,
        email: this.registerForm.get("email").value,
        firstName: this.registerForm.get("firstName").value,
        lastName: this.registerForm.get("lastName").value,
        mobilePhone: this.registerForm.get("mobilePhone").value,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      this.registerForm.disable();
      this.registerService
        .registerUser(user)
        .pipe(
          takeUntil(this.unsubscribeAll),
          tap((res) => {
            this.nameOfHeader = 'Registration Completed Successfully!';
            this.alert = {
              type: "success",
              message: "We have sent a confirmation email to the provided email address to continue the verification process",
            };
            this.hideForm = true;
          }),
          catchError((err) => {
            // Re-enable the form
            this.registerForm.enable();
            console.log(err);
            // Set the alert
            let message = '';
            if(err.status == 400) {
              // 400 bad request (email exists?)
                message = "Email already in use.";
            } else {
                message = "An Error Occured";
            }

            this.alert = {
              type: "error",
              message: message,
            };
            return EMPTY;
          }),
          finalize(() => {
            this.showAlert = true;
          })
        )
        .subscribe();
    }
  }

  openModal(name, e) {
    //open the policy type based on name in modal to be read and closed.
    e.stopPropagation();
    e.preventDefault();
    let dialogOpts = new MatDialogConfig();
    dialogOpts.width = '65%';
    dialogOpts.maxHeight = '90vh';

    if(name === "privacy_policy") {
      const dialog = this.dialog.open(PrivacyPolicyComponent, dialogOpts);
    } else if(name === "terms_conditions") {
      const dialog = this.dialog.open(TermsConditionsComponent, dialogOpts);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}

