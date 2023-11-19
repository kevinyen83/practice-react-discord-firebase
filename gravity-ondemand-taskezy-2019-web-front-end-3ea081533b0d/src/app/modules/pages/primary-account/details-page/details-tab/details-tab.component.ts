import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef, HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { EMPTY, first, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { AccountService } from 'app/core/services/account/account.service';
import { Account } from 'app/core/services/account/account';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { environment } from 'environments/environment';
import { HeaderButtonService } from "../../../../../core/services/header-with-button/header-with-button.service";
import { CanDeactivate } from "@angular/router";
import { ComplianceService } from "../../../../../core/services/compliance/compliance.service";

@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  animations: fuseAnimations
})
export class DetailsTabComponent implements OnInit, AfterViewChecked, OnDestroy {
  minDate: Date;
  maxDate: Date;
  abnInfo: any = {
    abn: '',
    name: '',
    entitytype: '',
    tradingname: ''
  };
  currentAccount: any = new Account();
  currentAvatar;
  defaultAvatar;
  viewSpinner = true;
  saved = true;
  zoom: number;
  status: string;
  detailFormCopy;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  editing = false;
  showAlert: boolean;
  boxTicked: boolean=true;
  industryOptions = [
    'Security',
    'Hospitality'
  ];

  detailsForm: FormGroup;


  private unsubscribeAll = new Subject();
  private addressTitlePost: ElementRef;
  private addressTitlePrimary: ElementRef;

  @ViewChild('addressTitlePost') set contentPostAddress(content: ElementRef) {
    if (content) {
      this.addressTitlePost = content;
      this.addPostAddressElement();
    }
  }
  @ViewChild('addressTitlePrimary') set contentPrimaryAddress(content: ElementRef) {
    if (content) {
      this.addressTitlePrimary = content;
      this.addPrimaryAddressElement();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    public complianceService: ComplianceService,
    private ngZone: NgZone,
    public headerButtonService: HeaderButtonService,
    private accountService: AccountService,
    private avatarService: AvatarService
  ) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'details' && !this.editing) {
        this.editDetails();
      } else if (res === 'details' && this.editing) {
        this.cancelEdit();
      }
    });

    this.headerButtonService.isSaved.subscribe(res => {
      if(res === 'details'){
        console.log('check isSavedSubscribe : ', res)
        this.saveDetails();
      }

    })
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.viewSpinner = true;
    this.minDate = moment().subtract(70, 'years').toDate();
    this.maxDate = moment().subtract(18, 'years').toDate();
    this.createDetailsForm();
    this.accountService.currentAccount
      .pipe(
        tap((res) => {
          if (res) {
            this.currentAccount = res;
            if (this.currentAccount.uuid) {
              this.patchDetailsForm();
              this.viewSpinner = false;
            }
          }
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  // checkValidForm() {
  //   if (this.detailsForm.valid) {
  //     this.homeService.activeLinks.next([
  //       "Dashboard",
  //       "Suppliers",
  //       "Resources",
  //       "Clients",
  //       "Roster",
  //       "Timesheet Register",
  //       "Venues",
  //       "Members",
  //       "Incidents",
  //       "Incident Report",
  //       "Interviews",
  //       "Assessments",
  //       "Assessment Templates",
  //       "Profile",
  //       "Details",
  //       "Profile Admins",
  //       "Logs",
  //       "Resource Pool",
  //     ]);
  //   }
  // }

  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file.files[0]);
    this.avatarService
      .uploadLogo(formData, this.currentAccount.uuid)
      // .pipe(
      //   takeUntil(this.unsubscribeAll)
      // )
      .subscribe((event: any) => {
        this.currentAvatar = `${environment.apiUrlFiles}/logo/${event.filename}`;
      });
  }
userTyped(){
  if (this.detailsForm.get('sameAddress').value && this.detailsForm.get('primaryAddress').value) {
    let currValue = this.detailsForm.get('primaryAddress').value;
    this.detailsForm.get('postAddress').patchValue(currValue);
}
}
  selectSameAddress(value) {

    if(value.checked == false){
      this.boxTicked = false
    }
    if(value.checked == true){
      this.boxTicked = true
    }
    if (value.checked && this.detailsForm.get('primaryAddress').value) {
      let currValue = this.detailsForm.get('primaryAddress').value;
      this.detailsForm.get('postAddress').patchValue(currValue);
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.saved) {
      const dialogRef = this._fuseConfirmationService.open({
        title: `You have unsaved Changes`,
        message: `Would you like to save your changes?`,
        actions: {
          confirm: {
            show: true,
            label: 'Save',
            color: 'primary'
          },
          cancel: {
            show: true,
            label: `Don't Save`
          }
        }
      });
      // const dialogRef = this.dialog.open(ConfirmActionComponent, {
      //   data,
      // });
      dialogRef.beforeClosed().pipe(
        tap((res) => {
          if (res) {
            // this.saveMyAccount();
            return true;
          } else {
            return false;
          }
        })
      );
    } else {
      return true;
    }
  }

  addPostAddressElement() {
    const autoComplete = new google.maps.places.Autocomplete(this.addressTitlePost.nativeElement, {
      types: ['address']
    });
    autoComplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoComplete.getPlace();
        if (place && place['formatted_address']) {
          this.detailsForm.get('postAddress').patchValue(place['formatted_address']);
          this.accountService.postAddress = place['formatted_address'];
          this.selectSameAddress({ checked: this.detailsForm.get('sameAddress').value });
        }
        if (!place || (place && !place.geometry)) {
          return '';
        }
      });
    });
  }

  addPrimaryAddressElement() {
    const autoComplete = new google.maps.places.Autocomplete(this.addressTitlePrimary.nativeElement, {
      types: ['address']
    });
    autoComplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoComplete.getPlace();
        if (place && place['formatted_address']) {
          this.detailsForm.get('primaryAddress').patchValue(place['formatted_address']);
          this.accountService.primaryAddress = place['formatted_address'];
          this.selectSameAddress({ checked: this.detailsForm.get('sameAddress').value });
        }
        if (!place || (place && !place.geometry)) {
          return '';
        }
      });
    });
  }

  createDetailsForm() {
    this.detailsForm = new FormGroup({
      primaryIndustry: new FormControl(''),
      primaryAddress: new FormControl('', Validators.required),
      postAddress: new FormControl('', Validators.required),
      sameAddress: new FormControl(false),
      website: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required)
    });
    this.complianceService.detailsForm = this.detailsForm;
  }

  patchDetailsForm() {
    if (this.currentAccount.uuid) {
      this.abnInfo = {
        abn: this.currentAccount.detail.abn,
        name: this.currentAccount.detail.name,
        tradingname: this.currentAccount.detail.tradingname || '',
        entitytype: this.currentAccount.detail.entitytype
      };
      this.detailsForm.patchValue({
        ['primaryIndustry']: this.currentAccount.detail?.industry || '',
        ['phoneNumber']: this.currentAccount.detail?.phone || '',
        ['postAddress']: this.currentAccount.detail?.postal_address,
        ['primaryAddress']: this.currentAccount.detail?.primary_address,
        ['sameAddress']: this.currentAccount.detail?.primary_address === this.currentAccount.detail?.postal_address,
        ['website']: this.currentAccount.detail?.website || ''
      });

      if (this.currentAccount.detail && this.currentAccount.detail.logo) {
        this.currentAvatar = this.currentAccount.detail.logo;
      }

      this.detailFormCopy = this.detailsForm.value;
    }
  }

  // checkValidForm() {
  //   if (this.detailsForm.valid) {
  //     this.homeService.activeLinks.next(['Dashboard', 'Suppliers', 'Resources', 'Clients', 'Roster',
  //       'Timesheet Register', 'Venues', 'Members', 'Incidents', 'Incident Report', 'Interviews', 'Assessments', 'Assessment Templates',
  //       'Profile', 'Details', 'Profile Admins', 'Logs', 'Resource Pool']);
  //   }
  // }

  saveDetails() {
    let accountDetails = {
      logo: this.currentAvatar || '',
      phone: this.detailsForm.get('phoneNumber').value,
      website: this.detailsForm.get('website').value,
      industry: this.detailsForm.get('primaryIndustry').value,
      primary_address: this.detailsForm.get('primaryAddress').value,
      postal_address: this.detailsForm.get('postAddress').value
    };

    this.accountService
      .updateDetail(this.currentAccount.uuid, accountDetails)
      .pipe(
        switchMap(() => {
          return forkJoin(this.accountService.getAllAccounts(), this.accountService.setCurrentAccount(this.currentAccount.uuid));
        }),
        tap((data) => {
          this.editing = false;
          this.viewSpinner = false;
          this.alert = {
            type: 'success',
            message: 'Your Account Details are saved.'
          };
          this.showAlert = true;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  editDetails() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    // clear the edits and go back to previous data
    this.detailsForm.setValue(this.detailFormCopy);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}

export class ConfirmDeactivateGuard implements CanDeactivate<any> {

  canDeactivate(component: DetailsTabComponent): Observable<any> | boolean {
    if (component.complianceService.detailsForm.touched) {
      return component.headerButtonService.getConfirmation().afterClosed().pipe(
        map(result => {
          if (result === 'confirmed') {
            return true;
          } else {
            return false;
          }
        }), first());
    } else {
      return of(true);
    }
  }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('newPassword') || control.parent.get('password');
  const passwordConfirm = control.parent.get('confirmPassword');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};

export const differentNewPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const newPassword = control.parent.get('newPassword');
  const oldPassword = control.parent.get('oldPassword');

  if (!newPassword || !oldPassword) {
    return null;
  }

  if (newPassword.value === '') {
    return null;
  }

  if (newPassword.value !== oldPassword.value) {
    return null;
  }

  return { passwordCantBeSame: true };
};
