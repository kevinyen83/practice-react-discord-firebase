import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { FuseAlertType } from '@fuse/components/alert';
import { takeUntil, tap } from 'rxjs/operators';
import { of, combineLatest, EMPTY, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs';
import _ from 'lodash'

import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { UtilService } from 'app/core/services/utils/util.service';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import { MatDrawer } from '@angular/material/sidenav';
import { VenuesService } from "../../../../../core/services/venues/venues.service";
import { HeaderButtonService } from "../../../../../core/services/header-with-button/header-with-button.service";

export enum currentTab {
  RESOURCE_DETAILS_TAB = 'Resource details',
  REPORTS_TAB = 'Reports',
  ROSTER_DETAILS_TAB = 'Roster Details',
  DOCUMENTS_TAB = 'Documents',
  // INTERVIEWS_ASSESSMENTS_TAB = 'Interviews and Assessments',
  INTERVIEWS_ASSESSMENTS_TAB = 'Assessments',
  // LICENCES_ACCREDITATIONS_TAB = 'Licences and Accreditations',
  LICENCES_ACCREDITATIONS_TAB = 'Accreditations',
  CHARGE_RATES_STATISTICS_TAB = 'Charge Rates and Statistics'
}

@Component({
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreateResourceComponent implements OnInit, OnDestroy {
  @Input() type = 'resource';
  status = 'edit';
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  licences = [];
  assessments = [];
  inductions = [];
  headerDocuments = 'Documents';
  documents = [];
  interviews = [];
  rates = [];
  accreditations = [];
  viewTab: boolean = true;
  viewDetailResource: boolean = true;
  viewReportsResource: boolean = false;
  viewRosterDetails: boolean = false;
  viewDocumentsResource: boolean = false;
  viewInterviewsAssessments: boolean = false;
  viewLicencesAccreditation: boolean = false;
  viewChargeRatesStatistics: boolean = false;
  tabs = [
    { name: 'Resource details' },
    // { name: 'Reports' },
    { name: 'Roster Details' },
    { name: 'Documents' },
    // { name: 'Interviews and Assessments' },
    { name: 'Assessments' },
    { name: 'Accreditations' },
    // { name: 'Charge Rates and Statistics' }
  ];
  resources: any[] = [];
  showAlert: boolean;
  // connectedResources = [];
  currentResource: any = null;
  selectedTab: string = 'Resource details';
  unsubscribeAll = new Subject<any>();
  currentAccount: any = {};
  selectedUUID = ''
  currentTab;

  @ViewChild('matDrawerAddAccreditation') matDrawerAddAccreditation: MatDrawer;

  // user: string;
  constructor(
    private accountService: AccountService,
    private resourcesService: ResourcesService,
    private listResourceService: ResourcesService,
    private headerButtonService: HeaderButtonService,
    private venuesService: VenuesService,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilService,
    private documentService: DocumentsService
  ) {}

  ngOnInit() {
    // this.headerButtonService.isEditing.subscribe(res => {
    //   if (res === 'addVenue') {
    //     this.handleLoadAccreditations();
    //   }
    // });

    this.venuesService.currentTab.subscribe(res=>{
      this.currentTab = res
    })

    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'addAccreditations') {
        this.toggleAccreditation();
      }
    });
    combineLatest([
      this.accountService.currentAccount,
      this.route['params'],
      // this.assessmentsService.getAllAssessments(),
      // this.listResourceService.getInterviews(),
      // this.listResourceService.getInductions(),
      this.listResourceService.getResourceRates(),
      // this.listResourceService.getResourceAccreditations(),
      this.accountService.connectedResources
    ])
      .pipe(
        tap((res: any) => {
          this.currentAccount = res[0];
          const params = res[1];
          this.selectedUUID = params['id'];
          // this.assessments = res[2];
          // this.interviews = res[3];
          this.rates = res[2];
          this.venuesService.currentTab.next(this.selectedTab);
          //// TODO: most of these should be attatched to the resource record so should be removed from this call above.
          // this.handleSetAccreditations(res[6]);
          // this.handleSetInductions(res[4]);
          // this.connectedResources = res[7];
          if (this.currentAccount?.uuid) {
            // if (params['id']) {
            //   this.status = 'edit';
            //   return this.resourcesService.currentResource;
            // }
            const resources = [
              ...this.currentAccount.resources.map((curRes) => {
                curRes.supplier = { name: 'Direct', uuid: this.currentAccount.uuid };
                return curRes;
              }),
              ...res[3].map((conres) => {
                conres.resource.supplier == conres.supplier;
                return conres.resource;
              })

            ];
            this.currentResource = resources.find((theRes) => theRes.user_id == params['id']);
            this.currentResource.formdata = this.currentResource.formdata || [];
            this.handleSetAccreditations(this.currentResource.formdata.filter((fd) => fd.type == 'Accreditation'));
            this.handleSetInductions(this.currentResource.formdata.filter((fd) => fd.type == 'Induction'));
            // let findResource = this.connectedResources.find((conres) => conres.resource.user_id === params['id']);
            // if (findResource) {
            //   this.user = 'member';
            // } else {
            //   this.user = 'resource';
            // }
          } else {
            return of(null);
          }
        }),
        catchError((err) => this.handleError(err)),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  handleError(err): any {
    if (!(err instanceof HttpErrorResponse) || err.status !== 404) {
      return throwError(err);
    } else {
      return EMPTY;
    }
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

  goToDetailResource(event) {
    this.viewTab = true;
    this.viewDetailResource = true;
  }

  backToResources() {
    this.router.navigate(['pages/list-resources']);
  }

  goToNextPage(event) {
    this.selectedTab = event;
    this.venuesService.currentTab.next(this.selectedTab);
    if (this.selectedTab === currentTab.RESOURCE_DETAILS_TAB) {
      this.viewDetailResource = true;
      this.viewReportsResource = false;
      this.viewRosterDetails = false;
      this.viewDocumentsResource = false;
      this.viewInterviewsAssessments = false;
      this.viewLicencesAccreditation = false;
      this.viewChargeRatesStatistics = false;
    } else if (this.selectedTab === currentTab.REPORTS_TAB) {
      this.viewDetailResource = false;
      this.viewReportsResource = true;
      this.viewRosterDetails = false;
      this.viewDocumentsResource = false;
      this.viewInterviewsAssessments = false;
      this.viewLicencesAccreditation = false;
      this.viewChargeRatesStatistics = false;
    } else if (this.selectedTab === currentTab.ROSTER_DETAILS_TAB) {
      this.viewRosterDetails = true;
      this.viewDocumentsResource = false;
      this.viewInterviewsAssessments = false;
      this.viewLicencesAccreditation = false;
      this.viewChargeRatesStatistics = false;
      this.viewDetailResource = false;
      this.viewReportsResource = false;
    } else if (this.selectedTab === currentTab.DOCUMENTS_TAB) {
      this.viewDocumentsResource = true;
      this.viewInterviewsAssessments = false;
      this.viewLicencesAccreditation = false;
      this.viewChargeRatesStatistics = false;
      this.viewDetailResource = false;
      this.viewReportsResource = false;
      this.viewRosterDetails = false;
    } else if (this.selectedTab === currentTab.INTERVIEWS_ASSESSMENTS_TAB) {
      this.viewDocumentsResource = false;
      this.viewInterviewsAssessments = true;
      this.viewLicencesAccreditation = false;
      this.viewChargeRatesStatistics = false;
      this.viewDetailResource = false;
      this.viewReportsResource = false;
      this.viewRosterDetails = false;
    } else if (this.selectedTab === currentTab.LICENCES_ACCREDITATIONS_TAB) {
      this.viewDocumentsResource = false;
      this.viewInterviewsAssessments = false;
      this.viewLicencesAccreditation = true;
      this.viewChargeRatesStatistics = false;
      this.viewDetailResource = false;
      this.viewReportsResource = false;
      this.viewRosterDetails = false;
    } else if (this.selectedTab === currentTab.CHARGE_RATES_STATISTICS_TAB) {
      this.viewDocumentsResource = false;
      this.viewInterviewsAssessments = false;
      this.viewLicencesAccreditation = false;
      this.viewChargeRatesStatistics = true;
      this.viewDetailResource = false;
      this.viewReportsResource = false;
      this.viewRosterDetails = false;
    }
  }

  updateProfile(event) {
    this.listResourceService
      .getCurrentResource(this.currentAccount.uuid, this.currentResource.uuid)
      .pipe(
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          this.handleError(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.currentResource = res;
      });
  }

  saveResource() {
    if (this.listResourceService.detailsForm.invalid) {
      this.listResourceService.setErrors.next(true);
      return;
    } else {
      let resource: any = {
        detail: {}
      };
      for (let control in this.listResourceService.detailsForm.controls) {
        resource['detail'][control] = this.listResourceService.detailsForm.get(control).value;
      }
      // if (this.status === 'create') {
      //   this.listResourceService
      //     .addResource(this.currentAccount.uuid, resource)
      //     .pipe(
      //       takeUntil(this.unsubscribeAll),
      //       catchError((err) => {
      //         console.log(err);
      //         this.handleError(err);
      //         return EMPTY;
      //       })
      //     )
      //     .subscribe((res) => {
      //       this.router.navigate(['pages/list-resources']);
      //     });
      // }
      if (this.status === 'edit') {
        resource.uuid = this.currentResource.uuid;
        this.listResourceService
          .updateResource(this.currentAccount.uuid, this.currentResource.uuid, resource)
          .pipe(
            // takeUntil(this.unsubscribeAll),
            catchError((err) => {
              console.log(err);
              this.handleError(err);
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.router.navigate(['pages/list-resources']);
          });
      }
    }
  }

  cancel() {
    this.router.navigate(['pages/list-resources']);
  }

  saveDocuments(documents) {
    this.documents.push(documents);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  toggleAccreditation() {
    this.matDrawerAddAccreditation.toggle();
  }

  deleteAccreditations(event) {
    this.accountService.deleteResourceFormDataByUUID(this.currentAccount.uuid, this.currentResource.user_id, event?.uuid).pipe(
      tap(res => {
        this.accreditations = this.accreditations.filter(acc => acc.uuid !== event.uuid);
      })
    ).subscribe()
  }

  handleLoadAccreditations() {
    this.accountService.getResourceFormData(this.currentAccount.uuid, this.selectedUUID).subscribe((res: any) => {

      this.handleSetAccreditations(res)
    })
  }

  closeSideNav(evt) {
    this.matDrawerAddAccreditation.toggle();

    if(evt?.refresh) {
      this.handleLoadAccreditations();
    }
  }
}
