import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';

import { HeaderButtonService } from "../../../core/services/header-with-button/header-with-button.service";
import { VenuesService } from "../../../core/services/venues/venues.service";
import { UtilService } from "../../../core/services/utils/util.service";
import { tap } from "rxjs/operators";
import { takeUntil } from "rxjs";

import { AccountService } from "../../../core/services/account/account.service";
import { UserProfileService } from "../../../core/services/user-profile/user-profile.service";

@Component({
  selector: 'app-header-with-buttons',
  templateUrl: './header-with-buttons.component.html'
})
export class HeaderButtonsComponent implements OnInit {

  // @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any>;
  buttonsTemplate: TemplateRef<any> | null = null;
  @Input() title: string = 'NoTitle';
  @Input() isDetailPage: boolean = false;
  @Input() isSubAccount: boolean = false;
  @Input() isVenuePage: boolean = false;
  @Input() isRosterPage: boolean = false;
  @Input() isResourcePage: boolean = false;
  @Input() isAdminOfCurrentAccount: boolean = false;
  @Input() status;
  @Input() type;
  @Input() avatar;
  @Input() abn;
  @Input() isExist: boolean = false;
  @Input() activeTab: string;
  @Input() userType
  // @Input() isOnVenueDetail
  currentAccount: any;
  currentTab;
  currentAvatar: string;
  detailsForm: any;
  view: string;
  editing: boolean;
  viewSpinner: boolean;
  alert: { type: string; message: string; };
  showAlert: boolean;
  isVenueTap: string = "venue";
  venueForm = this.headerButtonService.venueForm;
  isVenueTab;
  currentTabLocation:string;
  typeOfManagedEmail
  typeOfManagedConnection
  // currentTab: string;

  // constructor(private headerButtonService: HeaderButtonService) {
  //   this.isVenueTap = this.headerButtonService.isVenueTap
  //  }


  constructor(public headerButtonService: HeaderButtonService,
              public utils: UtilService,
              private accountService: AccountService,
              private userProfileService: UserProfileService,
              private venuesService: VenuesService) {
                // this.isVenueTap = this.headerButtonService.isVenueTap
               }


//  ngAfterViewInit(): void {
//   this.headerButtonService.updateTemplate(this.buttonsTemplate);
// }

  ngOnInit(): void {
    // console.log(" this.accountService?.selectedAccount: ",  this.accountService?.selectedAccount)
    this.typeOfManagedEmail = this.accountService?.selectedAccount?._value?.invitation?.email
    this.typeOfManagedConnection = this.accountService?.selectedAccount?._value?.connection_request?.relationship
    // console.log("this.typeOfManaged: ",this.typeOfManagedEmail)
    // console.log("this.accountService?.selectedAccount: ", this.accountService?.selectedAccount)
    this.headerButtonService.template$.subscribe(template => {
      this.buttonsTemplate = template;
    });

    this.headerButtonService.isVenueTab.subscribe((isVenueTab)=>{
      this.isVenueTab = isVenueTab
      // console.log("checked the value of isVenueTab, subscribed: ", this.isVenueTab)
    })
    // console.log("check the value of isVenueTab", this.isVenueTab)
    this.headerButtonService.testFunction();
    this.venuesService.currentTab.subscribe(res => {
      this.currentTab = res;
    });

    const currentUser = this.userProfileService.currentUser.getValue();
    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          this.currentAccount = res;
          console.log("lets check res: ", res)
          if (this.currentAccount && this.currentAccount?.members) {
            this.currentAccount?.members.forEach((m) => {
              if (m.user_id === currentUser.id && m.role == 3) {
                this.isAdminOfCurrentAccount = true;
              }
            });

            // this.isAdminOfCurrentAccount = this.currentAccount?.members.find((m) => m.user_id === this.currentAccount.primaryadmin);
          }
          // this.suppliers = this.currentAccount?.suppliers;
        })
      )
      .subscribe();
    if (this.isDetailPage) {
      this.view = 'details';
    } else if (this.isSubAccount) {
      this.view = 'subAccount';
    } else if (this.isVenuePage) {
      this.view = 'venue';
    }
  }

  saveDetails() {
    this.editing = false;
    this.headerButtonService.saveAccountDetails(this.view);
  }

  isEditDetails(){
    // console.log("isEditDetails", this.view)
    this.editing = true
    this.headerButtonService.changeView(this.view);
  }

  activate() {
    this.headerButtonService.changeStatus('activate');
  }

  deactivate() {
    this.headerButtonService.changeStatus('deactivate');
  }

  cancelResource() {
    this.headerButtonService.changeView('cancelResource');
  }

  saveResource() {
    this.headerButtonService.changeView('saveResource');
  }

  editResource() {
    this.headerButtonService.changeView('editResource');
  }

  toggleAccreditation() {
    this.headerButtonService.changeView('toggleAccreditationResource');
  }

  isCancelEdit(){
    this.editing = false
    // console.log("isCancelEdit", this.view)
    // this.headerButtonService.cancelEdit(this.view);
    // console.log("isCancelEdit")
    this.headerButtonService.changeView(this.view);
  }

  openAddVenue() {
     this.editing = true;
     this.headerButtonService.changeView('addAccreditations');
  }

  cancelVenue() {
    this.editing = false;
    this.headerButtonService.changeView('cancelVenue');
  }

  handleAddAccreditation() {
    // this.goToAddAccreditations.emit();
  }

  saveVenue() {
    this.editing = false;
    this.headerButtonService.saveAccountDetails('saveVenue');
  }

  venueEdit(){
    console.log('venue edit: ', this.view)
    // this.headerButtonService.editDetails(this.view);
    this.editing = true
    this.headerButtonService.changeView('edit');
  }

  venueDelete(){
    this.headerButtonService.changeView('deleteVenue');
  }

  venueSaveForVenueDetails(){
    this.editing = false;
    this.headerButtonService.changeView('saveVenue');
  }
}
