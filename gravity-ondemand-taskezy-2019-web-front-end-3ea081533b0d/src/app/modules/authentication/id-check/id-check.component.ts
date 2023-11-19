import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";

import { fuseAnimations } from "@fuse/animations";
import { AccountService } from "app/core/services/account/account.service";
import { DigitalIDVerificationService } from "app/core/services/auth/digitalid-verification/digitalid-verification.service";
import { LoginService } from "app/core/services/auth/login/login.service";
import { RefreshService } from "app/core/services/auth/refresh/refresh.service";
import { UserProfileService } from "app/core/services/user-profile/user-profile.service";
import { environment } from "environments/environment";

const VIEW_MODE_FORM = 'VIEW_MODE_FORM';
const VIEW_MODE_PREVIEW = 'VIEW_MODE_PREVIEW';


@Component({
  selector: "app-id-check",
  templateUrl: "./id-check.component.html",
  animations: fuseAnimations
})
export class IDCheckComponent implements OnInit {
  @ViewChild("address") set contentAddress(content: ElementRef) {
    if (content) {
      this.address = content;
      this.addAddressElement();
    }
  }
  address;

  userInfor = {
    "sub": "idty29Vo7DamJTPvl0YTnV2KEd",
    "name": "test test test",
    "given_name": "test",
    "family_name": "test",
    "middle_name": "test",
    "birthdate": "1992-11-12",
    "updated_at": 1689041706,
    "field_6a3987": false
  }

  registerForm: FormGroup;

  viewMode = VIEW_MODE_FORM

  constructor(
    private ngZone: NgZone,
    public loginService: LoginService,
    public digitalIDService: DigitalIDVerificationService,
    public accountService: AccountService,
    public _formBuilder: FormBuilder,
    public userProfileService: UserProfileService,
    private refreshService: RefreshService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.buildForm()
  }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if(token) {
      localStorage.setItem('refreshToken', token)
      this.refreshService.refreshWithRefreshToken().subscribe();
    }

    const script = document.createElement('script');

    script.src = environment.digitalIDUrl;
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {

      // @ts-ignore
      window.digitalId.init({
        clientId: environment.digitalIDClientId,
        uxMode: 'popup',
        buttonConfig: {type: 'basic',
        label:'Verify now'},
        onLoadComplete() {

        },
        onComplete: (msg) => {
          if(msg.code) {
            this.digitalIDService.verifyCode(msg.code).subscribe(res => {
              this.userInfor = res;
              this.viewMode = VIEW_MODE_PREVIEW
            })
          }
          if(msg.error === "verification_failed") {
            this.showSnackBar("Verification Failed. Please try again later")
          }
        },
        onClick(opts) {
        },
        onKeepAlive() {
        }
      });
    };
  }

  showSnackBar(text) {
    this.snackBar.open(`${text}`, 'X', {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  addAddressElement() {
    const autoComplete = new google.maps.places.Autocomplete(
      this.address.nativeElement,
      {
        types: ["address"],
      }
    );
    autoComplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoComplete.getPlace();
        if (place && place["formatted_address"]) {
          this.registerForm
            .get("address")
            .patchValue(place["formatted_address"]);
        }
        if (!place || (place && !place.geometry)) {
          return "";
        }
      });
    });
  }


  signOut() {
    this.loginService.signOut();
  }

  buildForm(): void {
    this.registerForm = this._formBuilder.group({
      address: ["", Validators.required],
    });
  }

  handleSave() {
    if(this.registerForm.valid) {
      this.userProfileService.updateUserProfile({
        firstName: this.userInfor.given_name,
        lastName: this.userInfor.family_name,
        birthDate: this.userInfor.birthdate,
        address: this.registerForm.get('address').value
      }).subscribe(res => {
        this.refreshService.refreshWithRefreshToken().subscribe();
      })

    }
  }

}
