import { Component, Input, EventEmitter, OnInit, Output, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { combineLatest, EMPTY, Subject, switchMap } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ResourcesService } from '../../../../core/services/resource/resources.service';
import { VenuesService } from '../../../../core/services/venues/venues.service';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import _ from 'lodash'
import {HeaderButtonService} from "../../../../core/services/header-with-button/header-with-button.service";

@Component({
  selector: 'app-sub-account-details',
  templateUrl: './sub-account-details.component.html'
})
export class SubAccountDetailsComponent implements OnInit, OnDestroy, OnChanges {
  selectedIndex: number = 0;

  tabs = [
    { name: 'Details' },
    { name: 'Members' },
    { name: 'Resources' },
    { name: 'Documents' }];

  venues: any[] = [];
  members: any[] = [];
  invites: any[] = [];
  documents: any[] = [];
  viewSpinner = false;
  isMembersActive = false;
  viewListVenues = false;
  viewAddVenue = false;
  creatingAccount: any;
  statusMember = 'add';
  currentAccount;
  savedDetails = false;
  statusForm = 'add';
  // viewDocuments = false;
  abnInfo;
  viewListResource = true;
  currentMember;
  tab;
  suppliers = [];
  clients = [];
  resources = [];
  currentVenue: any;
  currentResource: any;
  assessments = [];
  interviews = [];
  inductions = [];
  rates = [];
  accreditations = [];

  status;
  subTabs = [];

  selectedVenueUuid;

  // @Input() account;
  unsubscribeAll = new Subject<any>();
  @Input() accountType;
  @Input() accountUUID;
  selectedAccount;

  @Output() backPrev = new EventEmitter<any>();
  @Output() addAccreditation = new EventEmitter<any>();
  @ViewChild('matDrawerAddAccreditation') matDrawerAddAccreditation: MatDrawer;

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private accountService: AccountService,
    private venuesService: VenuesService,
    private headerButtonService: HeaderButtonService,
    private listResourceService: ResourcesService,
    private documentService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.headerButtonService.isEditing.subscribe(res => {
      // if (res === 'addAccreditations' && this.accountType == 'supplier') {
      //   this.goToAddForm()
      // }
      // else
      if(res==='addAccreditations' && this.accountType == 'client'){
        this.handleAddAccreditation()
      }else if(res==='addVenue' && this.accountType == 'client'){
        this.goToAddForm()
      }
    });
    this.currentAccount = this.accountService.currentAccount.getValue();
    if (this.accountType == 'client') {
      this.tabs = [
        { name: 'Details' },
        { name: 'Members' },
        { name: 'Venues' },
        // { name: 'Resources' },
        { name: 'Documents' },
        {name: 'Accreditations'}];
    } else if (this.accountType == 'supplier') {
      this.tabs = [
        { name: 'Details' },
        { name: 'Members' },
        { name: 'Resources' },
        { name: 'Documents' }, {
          name: 'Accreditations'
        }];
    }
    this.accountService.selectedAccount
      .pipe(
        takeUntil(this.unsubscribeAll),
        switchMap((res) => {
          this.currentAccount = this.accountService.currentAccount.getValue();
          this.selectedAccount = res;
          this.status = this.accountService.selectedAccountStatus.getValue();
          if (Object.keys(this.selectedAccount.detail).length) {
            this.savedDetails = true;
          } else {
            this.savedDetails = false;
          }
          // if (!Object.keys(this.selectedAccount.detail).length) {
          //   this.savedDetails = false;
          // }
          this.suppliers = this.selectedAccount.suppliers || [];
          this.clients = this.selectedAccount.clients || [];
          // this.resources = this.selectedAccount.resources || [];
          this.venues = this.selectedAccount.venues || [];

          if (this.selectedVenueUuid) {
            this.setCurrentVenue(this.selectedVenueUuid);
          }

          this.members = this.selectedAccount.members || [];
          if (this.selectedAccount.invitation?.uuid) {
            this.invites = [
              ...this.selectedAccount.members,
              this.selectedAccount.invitation
            ];
          }
          this.documents = this.selectedAccount.documents || [];
          this.resources = this.selectedAccount.resources || [];

          if(this.accountType === 'supplier') {
            return this.accountService.getSupplierFormData(this.currentAccount.uuid, this.selectedAccount.uuid);
          } else if(this.accountType === 'client') {
            return this.accountService.getClientFormData(this.currentAccount.uuid, this.selectedAccount.uuid);
          } else {
            return EMPTY;
          }
        }),
        tap((res: any[]) => {
          this.handleSetAccreditations(res.filter((fd) => fd.type == 'Accreditation'));
        }),
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();

    // this.accountService.currentAccount
    //   .pipe(
    //     takeUntil(this.unsubscribeAll),
    //     switchMap((res: any[]) => {
    //       this.currentAccount = res;
    //     // }),
    //     // switchMap((res) => {
    //     //   this.handleSetAccreditations(res)
    //       return combineLatest([
    //         this.assessmentsService.getAllAssessments(),
    //         this.listResourceService.getInterviews(),
    //         this.listResourceService.getResourceRates()
    //       ]);
    //     }),
    //     tap((res) => {
    //       this.assessments = res[0];
    //       this.interviews = res[1];
    //       this.rates = res[2];
    //     }),
    //     catchError((err) => {
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe();
    this.tab = 'Details';
    this.venuesService.currentTab.next(this.tab);
  }

  handleSetAccreditations(accreditations) {
    accreditations.forEach((item) => {
      if(typeof (item.data || "") === 'string') {
        const licenceData = JSON.parse(item.data);
        item.licence = _.isArray(licenceData)? licenceData: [];
        if(item.licence && item.licence.length > 0) {
          item.licence.forEach(licenceItem => {
            if(licenceItem.type === 'image')
            this.handleLoadFiles(licenceItem);
          })
        }
      } else {
        item.licence = []
      }
    })
    this.accreditations = accreditations;
  }

  handleSetInductions(inductions) {
    inductions.forEach((item) => {
      if(typeof (item.data || "") === 'string') {
        const licenceData = JSON.parse(item.data);
        item.licence = _.isArray(licenceData)? licenceData: [];
        if(item.licence && item.licence.length > 0) {
          item.licence.forEach(licenceItem => {
            if(licenceItem.type === 'image')
            this.handleLoadFiles(licenceItem);
          })
        }
      } else {
        item.licence = []
      }
    })
    this.inductions = inductions;
  }

  handleLoadFiles(licenceItem) {
    if(licenceItem.value) {
      this.documentService.getFilesDownload(licenceItem.value).pipe(
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onload = () => {
          licenceItem.url = event.target["result"];
        };
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  // backToVenues() {
  //   if (this.currentVenue) {
  //     this.goToListVenues();
  //   }
  // }

  // ngOnChanges() {
  //   this.accountService.updatedInvites.subscribe(res => {
  //     this.invites = res;
  //   });
  // }

  back() {
    this.backPrev.emit();
  }

  // saveDocuments(event) {
  //   this.viewDocuments = true;
  //   // if (this.accountType === 'client') {
  //   //   this.accountService.addClientDocuments(this.currentAccount.uuid, this.selectedAccount.uuid, event).pipe(
  //   //   ).subscribe()
  //   // }
  //   // this.accountService.selectedAccount.next({
  //   //   ...this.creatingAccount,
  //   //   documents: event,
  //   // });
  // }

  // addedMember(members) {
  //   this.members = members;
  //   // this.viewListMembers = true;
  //   this.accountService.selectedAccount.next({
  //     ...this.creatingAccount,
  //     members: this.members,
  //   });
  // }

  selectTab(tab) {
    this.tab = tab;
    if (this.subTabs.length && !this.subTabs.includes(this.tab)) {
      this.currentResource = null;
      this.currentVenue = null;
      this.selectedVenueUuid = null;
    }
    this.venuesService.currentTab.next(this.tab);
    console.log("check this tab: ", this.tab)
  }

  backToResources() {
    this.currentResource = null;
    this.tab = 'Resources';
  }

  // toFormMember(event) {
  //   // this.viewListMembers = false;
  //   if (event) {
  //     this.currentMember = event;
  //     this.statusMember = 'edit';
  //   }
  // }

  // goToListVenues() {
  //   this.viewListVenues = true;
  //   this.viewAddVenue = false;
  //   this.currentVenue = null;
  // }

  goToAddForm() {
    this.viewAddVenue = true;
    this.statusForm = 'add';
    this.viewListVenues = false;
  }

  gotoOpenVenue(event) {
    this.statusForm = 'edit';
    this.selectedVenueUuid = event;
    this.setCurrentVenue(this.selectedVenueUuid);
    if(this.accountService.currentAccountIsSubscriber) {
      this.subTabs = [
        'Venue details',
        'Venue manager',
        // 'Reports',
        'Engagement Details & Documents',
        // 'Resource Details',
        'Shift Roles'
      ];
    } else {
      this.subTabs = [
        'Venue details',
        // 'Venue manager',
        // 'Reports',
        // 'Engagement Details & Documents',
        // 'Resource Details',
        // 'Shift Roles'
      ];
    }
    this.tab = 'Venue details';
    this.venuesService.currentTab.next(this.tab);
  }

  setCurrentVenue(venueUuid) {

    if (this.selectedAccount?.uuid) {
      if (this.venues.length > 0 && venueUuid) {
        this.status = 'edit';
        this.currentVenue = this.selectedAccount?.venues.find((v) => v.uuid === venueUuid);
      }
    }
  }

  // cancelMember() {
  //   this.viewListMembers = true;
  // }

  updateView(data) {
    this.currentResource = data;
    this.tab = 'Resource Details';
    this.subTabs = [
      'Resource Details',
      // 'Reports',
      'Roster Details',
      'Documents',
      // 'Interviews and Assessments',
      'Assessments',
      'Accreditations',
      // 'Charge Rate and Statistics'
    ];
    // if (!data) {
    //   this.viewListResource = false;
    // }
  }

  addResource(resource) {
    const dialogRef = this._fuseConfirmationService.open({
      title: `The invitation is sent.`,
      message: `Do you want invite another resource?`,
      actions: {
        confirm: {
          show: true,
          label: 'Yes',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'No'
        }
      }
    });
    // const dialogRef = this.dialog.open(ModalSavedComponent, {
    //   width: '485px',
    //   data: {
    //     hText: `The invitation is sent.`,
    //     meanText: `Do you want invite another resource?`,
    //     buttons: ['No', 'Yes']
    //   }
    // });
    dialogRef.afterClosed().subscribe((res) => {
      // this.resources = [...this.resources, resource];
      if (res) {
        this.viewListResource = false;
      } else {
        this.viewListResource = true;
      }
    });
  }

  closeVenue() {
    this.tab = 'Venues';
    this.currentVenue = null;
    this.selectedVenueUuid = null;
    this.viewListVenues = true;
    this.viewAddVenue = false;
    console.log(this.tab);
  }

  cancelResource() {
    this.viewListResource = true;
  }

  goToDetails() {
    this.backPrev.emit();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  toggleAccreditation() {
    this.matDrawerAddAccreditation.toggle();
  }

  handleAddAccreditation() {
    this.addAccreditation.emit()
  }
}
