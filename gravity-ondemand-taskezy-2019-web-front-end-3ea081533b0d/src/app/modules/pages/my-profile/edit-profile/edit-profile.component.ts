import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { AvatarService } from '../../../../core/services/avatar/avatar.service';
import { environment } from '../../../../../environments/environment';
import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';
import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentAvatar;
  defaultAvatar;
  newAvatar = null;
  // address: ElementRef;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  private addressTitle: ElementRef;
  @ViewChild('addressTitle') set contentAddress(content: ElementRef) {
    if (content) {
      this.addressTitle = content;
      this.addAddressElement();
    }
  }

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private userProfileService: UserProfileService,
    private avatarService: AvatarService,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildForm();
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.currentAvatar = this.data?.imageUrl;
  }

  buildForm() {
    this.profileForm = new FormGroup({
      first_name: new FormControl(this.data.firstName, Validators.required),
      last_name: new FormControl(this.data.lastName, Validators.required),
      mobile_number: new FormControl(this.data.mobilePhone, Validators.required),
      email: new FormControl(this.data.email, Validators.required),
      address: new FormControl(this.data.data.address, Validators.required)
    });
  }

  addAddressElement() {
    const autoComplete = new google.maps.places.Autocomplete(this.addressTitle.nativeElement, {
      types: ['address']
    });
    autoComplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoComplete.getPlace();
        if (place && place['formatted_address']) {
          this.profileForm.get('address').patchValue(place['formatted_address']);
          // this.accountService.primaryAddress = place["formatted_address"];
        }
        if (!place || (place && !place.geometry)) {
          return '';
        }
      });
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  uploadAvatar(file) {
    if (environment.e2e) {
      // this.avatarService
      //   .saveAvatarCloudinary(`avatar-${Math.random().toString().slice(2, 11)}`, 'https://picsum.photos/100?random=11')
      //   .then((response) => response.json())
      //   .then((data) => {
      this.uploadAvatarToProfile('https://picsum.photos/100?random=11');
      this.snackBar.open('Avatar Uploaded!', 'X', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      // });
    } else {
      const formData = new FormData();
      formData.append('file', file.files[0]);
      this.avatarService
        .uploadAvatar(formData)
        // .pipe(
        //   takeUntil(this.unsubscribeAll)
        // )
        .subscribe((event: any) => {
          this.currentAvatar = `${environment.apiUrlFiles}/avatar/${event.filename}`;
          this.uploadAvatarToProfile(this.currentAvatar);
          this.snackBar.open('Avatar Uploaded!', 'X', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        });
    }
  }

  uploadAvatarToProfile(url) {
    this.userProfileService
      .updateUserProfileAvatar(url)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.profileForm.valid) {
      this.dialogRef.close(this.profileForm);
    }
  }

  ngOnDestroy() {
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
