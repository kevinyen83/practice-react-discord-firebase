import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError } from 'rxjs/operators';
import { EMPTY, of, Subject, switchMap, tap} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { AvatarService } from '../../../../core/services/avatar/avatar.service';
import { environment } from 'environments/environment';
import { UtilService } from 'app/core/services/utils/util.service';
import {HeaderButtonService} from "../../../../core/services/header-with-button/header-with-button.service";

@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  animations: fuseAnimations
})
export class DetailsFormComponent implements OnInit, OnDestroy {
  @Input() accountType;
  @Input() suppliers;
  @Input() clients;
  @Input() status = 'edit';
  @Input() passAbnInfo: any;
  @Input() isCreatingClient: boolean = true
  @Output() statusEditDetailsForm = new EventEmitter<any>();
  @Output() savedDetails = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<any>();

  editing = false;
  creating = true;
  selectedAccount;
  detailsForm: FormGroup;

  currentAccount: any;
  currentUser: any;
  currentAvatar: any;
  currentFile: any;

  unsubscribeAll = new Subject<any>();
  saved = true;
  savedClient = false;
  savedResource = false;
  savedSupplier = false;
  viewSpinner = false;
  preview;

  autoComplete;
  abnInfo: any = {
    abn: '',
    name: '',
    entitytype: '',
    tradingname: ''
  };
  venueAddress;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  errorsFields = [];
  showAlert: boolean;
  boxTicked: boolean=false;
  detailFormCopy;
  defaultAvatar;

  industryOptions = [
    'Security',
    'Hospitality'
  ];
  managedTypeOptions = [
    'Internally Managed',
    'Externally Managed'
  ];
  selectedManagedType:string = 'internally';
  private addressTitlePost: ElementRef;
  private addressTitlePrimary: ElementRef;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

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

  constructor(
    private ngZone: NgZone,
    public dialog: MatDialog,
    private avatarService: AvatarService,
    private headerButtonService: HeaderButtonService,
    private _fuseConfirmationService: FuseConfirmationService,
    private accountService: AccountService,
    public utils: UtilService
  ) {}

  ngOnInit() {
    this.headerButtonService.isAccountDetails.next('details')
    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'backToAdd') {
        this.cancelEdit()
      }
      if (res === 'saveNew') {
        this.saveDetails()
      }
    });
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    // this.accountService.setPauseRefresh(true);

    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'subAccount'&& !this.editing) {
        this.editDetails();
      } else if (res === 'subAccount' && this.editing) {
        this.cancelEdit();
      }
    });

    this.headerButtonService.isSaved.subscribe(res => {
      if (res === 'subAccount') {
        this.saveDetails();
      }
    });
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.createDetailsForm();
    this.viewSpinner = true;


    if (this.passAbnInfo && this.passAbnInfo['abn']) {
      this.abnInfo = this.passAbnInfo;
    }
    if (this.status === 'create') {
      this.creating = true;
      this.editing = true;
      this.accountService.resetSelectedAccount('create');
    } else {
      this.creating = false;
    }
    this.accountService.selectedAccount
      .pipe(
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.selectedAccount = res;
        console.log("selected account ---", this.selectedAccount)
        this.currentAccount = this.accountService.currentAccount.getValue();
        if (this.selectedAccount?.uuid && this.status !== 'create') {
          this.abnInfo = {
            abn: this.selectedAccount.detail?.abn,
            name: this.selectedAccount.detail?.name,
            entitytype: this.selectedAccount.detail?.entitytype,
            tradingname: this.selectedAccount.detail?.tradingname
          };
        }
        this.viewSpinner = false;
        if (this.abnInfo.abn !== '') {
          this.patchDetailsForm();
        }
      });
  }

  onSelectionChange(event){

    this.detailsForm.removeControl('nameAdministrator');
    this.detailsForm.removeControl('emailAdministrator');

    if (event.value === 'Internally Managed') {
          console.log("internally checked")
          this.selectedManagedType = 'internally'
        } else if (event.value === 'Externally Managed') {
          this.selectedManagedType = 'externally'
        }

    if(this.accountType==='client' && event?.value ==='Internally Managed'){
      this.detailsForm.addControl('nameAdministrator', new FormControl(''));
        this.detailsForm.addControl(
          'emailAdministrator',
          new FormControl('', Validators.email)
        );

      }

      if(this.accountType==='client' && event?.value==='Externally Managed'){
        this.detailsForm.addControl('nameAdministrator', new FormControl('', Validators.required));
        this.detailsForm.addControl(
          'emailAdministrator',
          new FormControl('', [Validators.required,Validators.email])
        );
        }
  }
  removeAvatar() {
    this.currentAvatar = null;
  }

  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file.files[0]);
    if (this.status === 'edit') {
      this.avatarService
        .uploadLogo(formData, this.selectedAccount.uuid)
        .pipe(
          catchError(err => {
            this.viewSpinner = false;
            this.alert = {
              type: 'error',
              message: 'Logo is not saved'
            };
            this.showAlert = true;
            return EMPTY;
          })
        )
        .subscribe(
          (event: any) => {
            this.currentAvatar = `${environment.apiUrlFiles}/logo/${event.filename}`;
          });
    } else {
      this.currentFile = file.files[0];
      this.getBase64(this.currentFile);
    }
  }

    declineInvite() {
    if (this.selectedAccount?.connection_request) {
      this.accountService.declineInviteForAccount(this.selectedAccount?.connection_request?.uuid)
        .subscribe(res => {
          this.selectedAccount = res;
        });
    }
  }

  acceptInvite() {
    if (this.selectedAccount?.connection_request) {
      this.accountService.acceptInviteForAccount(this.selectedAccount?.connection_request?.uuid)
        .subscribe(res => {
          this.selectedAccount = res;
        });
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(this.preview = reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // setErrorsOnControls() {
  //   for (let control in this.detailsForm.controls) {
  //     if (this.detailsForm.controls[control].errors) {
  //       this.detailsForm.controls[control].markAsTouched();
  //     }
  //   }
  // }

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
      managedType: new FormControl('Internally Managed'),
      primaryAddress: new FormControl('', Validators.required),
      postAddress: new FormControl('', Validators.required),
      sameAddress: new FormControl(false),
      website: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required)
    });

    if (this.status === 'create') {
      if(this.accountType==='client'){
      this.detailsForm.addControl('nameAdministrator', new FormControl(''));
      this.detailsForm.addControl(
        'emailAdministrator',
        new FormControl('', Validators.email)
      );
      }
      if(this.accountType==='supplier'){
        this.detailsForm.addControl('nameAdministrator', new FormControl('', Validators.required));
      this.detailsForm.addControl(
        'emailAdministrator',
        new FormControl('', [Validators.required,Validators.email] )
      );
      }
      // this.detailsForm.get('nameAdministrator').updateValueAndValidity();
      // this.detailsForm.get('emailAdministrator').updateValueAndValidity();
      // this.detailsForm.get('managedType').valueChanges.subscribe((selectedValue) => {

      //   if (selectedValue === 'Internally Managed') {
      //     console.log("internally checked")
      //     this.selectedManagedType = 'internally'
      //   } else if (selectedValue === 'Externally Managed') {
      //     this.selectedManagedType = 'externally'
      //   }
      // });
    }
  }

  selectSameAddress(value) {
    this.boxTicked = value.checked;

    if (value.checked && this.detailsForm.get('primaryAddress').value) {
      let currValue = this.detailsForm.get('primaryAddress').value;
      this.detailsForm.get('postAddress').patchValue(currValue);
    }
  }

  patchDetailsForm() {
    if (this.selectedAccount?.uuid) {
      this.abnInfo = {
        abn: this.selectedAccount?.detail.abn,
        name: this.selectedAccount?.detail.name,
        tradingname: this.selectedAccount?.detail.tradingname || '',
        entitytype: this.selectedAccount?.detail.entitytype
      };
      this.detailsForm.patchValue({
        ['primaryIndustry']: this.selectedAccount?.detail?.industry || '',
        ['phoneNumber']: this.selectedAccount?.detail?.phone || '',
        ['postAddress']: this.selectedAccount?.detail?.postal_address,
        ['primaryAddress']: this.selectedAccount?.detail?.primary_address,
        ['website']: this.selectedAccount?.detail?.website || '',
        // ['managedType']: this.selectedAccount?.detail?.managedType || '',
      });

      if (this.selectedAccount?.detail && this.selectedAccount?.detail?.logo) {
        this.currentAvatar = this.selectedAccount.detail.logo;
      }

      this.detailFormCopy = this.detailsForm.value;
    }
  }

  editDetails() {
    this.editing = true;
  }

  saveDetails() {
    // if the user ticks the checkbox and change the value of primary address again, needs to be synced again
    if (this.boxTicked ==true && this.detailsForm.get('primaryAddress').value) {
      let currValue = this.detailsForm.get('primaryAddress').value;
      this.detailsForm.get('postAddress').patchValue(currValue);
    }

    if (!this.viewSpinner) {
      this.viewSpinner = true;
      this.detailsForm.markAllAsTouched();

      if (this.detailsForm.valid) {
        let inviteDetail
        if (this.status == 'edit') {
         this.editingSelectedAccount();
        } else if (this.status == 'create') {
          if(this.selectedManagedType === 'externally'|| this.accountType == 'supplier'){
            inviteDetail = {
              invite_email: this.detailsForm.get('emailAdministrator').value,
              invite_name: this.detailsForm.get('nameAdministrator').value
            };
          }
          this.selectedAccount.detail = {
            account_detail: {
              abn: this.abnInfo.abn,
              tradingname: this.abnInfo.tradingname,
              entitytype: this.abnInfo.entitytype,
              name: this.abnInfo.name,
              logo: this.currentAvatar || '',
              website: this.detailsForm.get('website').value,
              industry: this.detailsForm.get('primaryIndustry').value,
              phone: this.detailsForm.get('phoneNumber').value,
              postal_address: this.detailsForm.get('postAddress').value,
              primary_address: this.detailsForm.get('primaryAddress').value
            },
            invite_detail: inviteDetail
          };

          const formData = new FormData();
          if (this.currentFile) {
            formData.append('file', this.currentFile);
          }

          if (this.accountType === 'client') {
            this.accountService
              .addClientToAccount(this.currentAccount.uuid, this.selectedAccount.detail)
              .pipe(
                // takeUntil(this.unsubscribeAll),
                switchMap((res: any) => {
                  if (res.uuid) {
                    this.selectedAccount = res;
                    if (this.currentFile) {
                      return this.avatarService.uploadLogo(formData, res?.uuid);
                    } else {
                      return of({});
                    }
                  } else {
                    return EMPTY;
                  }
                }),
                tap(res => {
                  if (res?.filename) {
                    this.currentAvatar = `${environment.apiUrlFiles}/logo/${res.filename}`;
                    this.editingSelectedAccount();
                    return EMPTY;
                  } else {
                    this.accountService.refreshCurrentAccount();
                    this.detailsForm.reset();
                    this.editing = false;
                    this.viewSpinner = false;
                    this.accountService.isEditingAccount = true;
                    this.savedDetails.emit();
                  }
                }),
                catchError((err) => {
                  this.viewSpinner = false;
                  if (err.status == 500) {
                  }
                  this.alert = {
                    type: 'error',
                    message: 'Failed to create Client'
                  };
                  this.showAlert = true;
                  return EMPTY;
                })
              )
              .subscribe();
          } else if (this.accountType === 'supplier') {
            this.accountService
              .addSupplierToAccount(this.currentAccount.uuid, this.selectedAccount.detail)
              .pipe(
                // takeUntil(this.unsubscribeAll),
                switchMap((res: any) => {
                  if (res.uuid) {
                    this.selectedAccount = res;
                    if (this.currentFile) {
                      return this.avatarService.uploadLogo(formData, res?.uuid);
                    } else {
                      return of({});
                    }
                  } else {
                    return EMPTY;
                  }
                }),
                tap((res) => {
                  if (res?.filename) {
                    this.currentAvatar = `${environment.apiUrlFiles}/logo/${res.filename}`;
                    this.editingSelectedAccount();
                    return EMPTY;
                  } else {
                    this.accountService.refreshCurrentAccount();
                    this.detailsForm.reset();
                    this.editing = false;
                    this.viewSpinner = false;
                    this.accountService.isEditingAccount = true;
                    this.savedDetails.emit();
                  }
                }),
                catchError((err) => {
                  this.viewSpinner = false;
                  this.alert = {
                    type: 'error',
                    message: 'Failed to create Supplier'
                  };
                  this.showAlert = true;
                  return EMPTY;
                })
              )
              .subscribe();
          }
        }
      } else {
        // for (let control in this.accountService.detailsForm.controls) {
        //   if (this.accountService.detailsForm.controls[control].invalid) {
        //     invalidFields = [...invalidFields, control];
        //   }
        // }
        // if (!this.accountService.phoneNumber?.value) {
        //   invalidFields.push('phoneNumber');
        // }
        // this.accountService.detailsInvalidFields.next(invalidFields);
        this.viewSpinner = false;
      }
    }
  }

  editingSelectedAccount() {
    let detail = {
      industry: this.detailsForm.get('primaryIndustry').value,
      logo: this.currentAvatar || '',
      phone: this.detailsForm.get('phoneNumber').value,
      postal_address: this.detailsForm.get('postAddress').value,
      primary_address: this.detailsForm.get('primaryAddress').value,
      website: this.detailsForm.get('website').value,
    };

    if (this.accountType === 'client') {
      this.accountService
        .updateClientDetail(this.currentAccount.uuid, this.selectedAccount.uuid, detail, this.detailsForm)
        .pipe(
          tap((res: any) => {
            if (res) {
              this.selectedAccount = res;
              this.accountService.refreshCurrentAccount();
              this.editing = false;
              this.viewSpinner = false;
              this.savedDetails.emit();
              if ((res?.invitation?.email || res?.invitation?.uuid) && this.status !== 'edit') {
                this.getDialog();
              }
            }
          }),
          catchError((err) => {
            this.viewSpinner = false;
            this.alert = {
              type: 'error',
              message: 'Failed to save Client'
            };
            this.showAlert = true;
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.accountType === 'supplier') {
      this.accountService
        .updateSupplierDetail(this.currentAccount.uuid, this.selectedAccount.uuid, detail, this.detailsForm)
        .pipe(
          tap((res: any) => {
            if (res) {
              this.selectedAccount = res;
              this.accountService.refreshCurrentAccount();
              this.editing = false;
              this.viewSpinner = false;
              this.savedDetails.emit();
              if ((res?.invitation?.email || res?.invitation?.uuid) && this.status !== 'edit') {
                this.getDialog();
              }
            }
          }),
          catchError((err) => {
            this.viewSpinner = false;
            this.alert = {
              type: 'error',
              message: 'Failed to save Supplier'
            };
            this.showAlert = true;
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  getDialog() {
    const dialogRef = this._fuseConfirmationService.open({
      title: `Invite Administrator`,
      message: `You have nominated an Administrator to control this account. We will verify their authority before they can take over the account.`,
      icon: {
        show: false
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ok',
          color: 'primary'
        },
        cancel: {
          show: false,
          label: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.alert = {
          type: 'success',
          message: `The ${this.accountType} is saved.`
        };
        this.showAlert = true;
      }
    });
  }

  // alreadyExists(account) {
  //   //TODO: NEED TO CHECK THE WORKFLOW THAT IS MEANT TO HAPPEN HERE
  //   const dialogRef = this._fuseConfirmationService.open({
  //     title: `The ${account} already exists.`,
  //     message: `The ${account} already exists on our system, would you like to send a connection request?`,
  //     actions: {
  //       confirm: {
  //         show: true,
  //         label: 'Ok',
  //         color: 'primary'
  //       },
  //       cancel: {
  //         show: false
  //       }
  //     }
  //   });
  // }

  cancelEdit() {
    this.editing = false;
    this.detailsForm.reset();
    if (this.creating) {
      this.creating = false;
      this.cancelled.emit();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    this.accountService.setPauseRefresh(false);
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);

  }
}
