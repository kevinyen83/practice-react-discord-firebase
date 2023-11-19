import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

import { tap } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { AvatarService } from '../../../../core/services/avatar/avatar.service';
import { ResourcesService } from '../../../../core/services/resource/resources.service';
import { AccountService } from '../../../../core/services/account/account.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  animations: fuseAnimations
})
export class ResourceDetailsComponent implements OnInit, OnDestroy {
  resourceDetailsForm: FormGroup;
  memberDetailsForm: FormGroup;
  organisationRole: FormControl;
  department: FormControl;

  isAdminOfCurrentAccount = false;

  currentAvatar;
  currentAccount;
  defaultAvatar;
  editing = false;
  roles = [
    { label: 'Resource', value: 0 },
    { label: 'Assistant', value: 2 },
    { label: 'Manager', value: 1 },
    { label: 'Administrator', value: 3 }
  ];

  @Input() currentResource;
  @Input() type;
  @Input() modalClasses: string = 'bg-primary';
  @Input() modalTextColor: string = 'text-white';
  @Output() close = new EventEmitter<any>();


  private unsubscribeAll = new Subject();

  constructor(private userProfileService: UserProfileService,
              private avatarService: AvatarService,
              private accountService: AccountService,
              private headerButtonService: HeaderButtonService,
              private resourcesService: ResourcesService) {
    this.organisationRole = new FormControl('');
    this.department = new FormControl('');
  }

  ngOnInit(): void {
    this.defaultAvatar = this.avatarService.defaultAvatar;
    const currentUser = this.userProfileService.currentUser.getValue();

    this.headerButtonService.isChangeStatus.subscribe(res => {
      if (res === 'activate') {
        this.activate();
      } else if (res === 'deactivate') {
        this.deactivate();
      }
    });
    this.headerButtonService.isEditing.subscribe(res => {

      if (res === 'editResource') {
        this.editResource();
      } else if (res === 'cancelResource') {
        this.cancel();
      } else if (res === 'saveResource') {
        this.saveResource();
      }
    });
    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          this.currentAccount = res;
          if (this.currentAccount && this.currentAccount?.members) {
            this.currentAccount?.members.forEach((m) => {
              console.log(m);
              if (m.user_id === currentUser.id && m.role == 3) {
                this.isAdminOfCurrentAccount = true;
              }
            });

            // this.isAdminOfCurrentAccount = this.currentAccount?.members.find((m) => m.user_id === this.currentAccount.primaryadmin);
          }
          // this.suppliers = this.currentAccount?.suppliers;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
    if (this.currentResource?.account_detail?.logo) {
      this.currentAvatar = this.currentResource.account_detail.logo;
    }
  }

  deactivate() {
    if (this.type === 'resource') {
      this.accountService
        .deactivateResource(this.currentAccount?.uuid, this.currentResource?.user_id)
        .pipe(
          tap((res: any) => {
            this.resourcesService.currentResource = res;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else if (this.type === 'member') {
      this.accountService
        .deactivateAccountMember(this.currentAccount?.uuid, this.currentResource?.user_id)
        .pipe(
          tap((res) => {
            this.currentResource = res;
            let i = this.currentAccount.members.findIndex((m) => m.user_id === this.currentResource.user_id);
            this.currentAccount.members.splice(i, 1, this.currentResource);
            this.accountService.currentAccount = this.currentAccount;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  activate() {
    if (this.type === 'resource') {
      this.accountService
        .activateAccountResources(this.currentAccount?.uuid, this.currentResource?.user_id)
        .pipe(
          tap((res: any) => {
            this.resourcesService.currentResource = res;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
    else if (this.type === 'member') {
      this.accountService
        .activateAccountMember(this.currentAccount?.uuid, this.currentResource?.user_id)
        .pipe(
          tap((res) => {

            this.currentResource = res;
            let i = this.currentAccount.members.findIndex((m) => m.user_id === this.currentResource.user_id);
            this.currentAccount.members.splice(i, 1, this.currentResource);
            this.accountService.currentAccount = this.currentAccount;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  cancel() {
    // this.router.navigate(['pages/list-resources']);
    this.editing = false;
  }

  save() {
    if (this.type === 'member') {
      let newMember = {
        department: this.department.value,
        role: this.organisationRole.value
      };

      this.accountService
        .updateAccountMember(this.currentAccount.uuid, this.currentResource, newMember)
        .pipe(
          tap((res) => {
            this.currentResource = res;
            this.cancel();
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  getRole(role) {
    switch (role) {
      case 0:
        return 'Resource';
      case 1:
        return 'Manager';
      case 2:
        return 'Assistant';
      case 3:
        return 'Administrator';
    }
  }

  closeWindow() {
    this.close.emit();
  }

  getStatus(status) {
    return status === 0 ? 'Active' : 'Inactive';
  }

  getStatusColor(status) {
    return status === 0 ? 'text-green-400' : 'text-red-400';
  }

  editResource() {
    if (this.type === 'resource') {
      this.buildResourceDetailsForm();
      this.setValues();
    } else {
      this.buildMemberField();
    }
    this.editing = true;
  }

  buildMemberField() {
    this.organisationRole = new FormControl(this.currentResource?.role);
    this.department = new FormControl(this.currentResource?.department);
  }

  setValues() {
    this.resourceDetailsForm.patchValue({
      type: 'Direct',
      code: '',
      description: '',
      supplier: this.currentResource.supplier.name,
      buyRate: ''
    });
  }

  buildResourceDetailsForm() {
    this.resourceDetailsForm = new FormGroup({
      type: new FormControl(''),
      code: new FormControl(''),
      description: new FormControl(''),
      supplier: new FormControl(''),
      buyRate: new FormControl('')
    });
  }

  saveResource() {
    let details = {};
    if (this.type === 'resource') {
      details = {};
      this.accountService
        .updateResourceDetail(this.currentAccount.uuid, this.currentResource.user_id, details)
        .pipe(
          tap((res) => {
            this.editing = false;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    } else {
      details = {
        department: this.currentResource.department,
        role: this.memberDetailsForm.get('organisationRole').value
      };
      this.accountService
        .updateAccountMember(this.currentAccount.uuid, this.currentResource, details)
        .pipe(
          tap((res) => {
            this.editing = false;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    }
  }

  uploadPhoto(file) {
    this.getBase64(file.files[0]).then((avatar) => {
      this.currentAvatar = avatar;
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
