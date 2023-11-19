import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';

import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';
import { ComplianceService } from '../../../../core/services/compliance/compliance.service';
import { AccreditationService } from 'app/core/services/accreditation/accreditation.service';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import _ from 'lodash'
import { ConfirmModalComponent } from 'app/modules/common/confirm-modal/confirm-modal.component';
import { HeaderButtonService } from 'app/core/services/header-with-button/header-with-button.service';


const VIEW_MODE_DETAILS = 'Details';
const VIEW_MODE_ACCREDITATIONS = 'Accreditations';
const VIEW_MODE_SUBSCRIPTIONS = 'Subscription';
const VIEW_MODE_ACCOUNT_INVITES = 'Account Invites';

@Component({
  selector: 'app-primary-account-details',
  templateUrl: './primary-account-details.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class PrimaryAccountDetailsComponent implements OnInit, OnDestroy {
  // context={activeTab:'activeTab', title:'Details', isDetailPage:'true', goToAddAccreditations:'toggleAccreditation()'}
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  // @ViewChild('postalAddress', { read: true, static: false }) postalAddress;
  // @ViewChild('address', { read: true, static: false }) address;
  // buttonsTemplate: TemplateRef<any>;
  @ViewChild('matDrawerAddAccreditation') matDrawerAddAccreditation: MatDrawer;
  public searchElementRef: ElementRef;

  public searchPostalElementRef: ElementRef;

  selectedIndex = 0;

  accreditations = [];
  invitations = [];
  zoom: number;
  status: string;
  isPlan = false;
  currentAccount;
  activeTab = VIEW_MODE_DETAILS
  deleteAccreditation: any

  tabs = [
    { name: VIEW_MODE_DETAILS },
    { name: VIEW_MODE_ACCREDITATIONS },
    { name: VIEW_MODE_SUBSCRIPTIONS },
    { name: VIEW_MODE_ACCOUNT_INVITES }];

  private unsubscribeAll = new Subject();

  constructor(private complianceService: ComplianceService,
              private accountService: AccountService,
              public dialog: MatDialog,
              private accreditationService: AccreditationService,
              private documentService: DocumentsService,
              private headerButtonService: HeaderButtonService) {}

  ngOnInit() {
    // this.headerButtonService.updateTemplate(this.buttonsTemplate);
    this.headerButtonService.template$.subscribe(template => {
      this.buttonsTemplate = template;
    });
    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'addAccreditations') {
        this.toggleAccreditation();
      }})

    this.handleFetchAccreditation();
    this.accountService.currentAccount.pipe(
      switchMap((res: any) => {
        let currentAccount = res;
        if (currentAccount?.uuid) {
          return this.accountService.getInvitesForAccount(currentAccount.uuid);
        } else {
          return of([]);
        }
      }),
      tap((res: any) => {
        this.invitations = res;
      })
    ).subscribe();
  }
  ngAfterViewInit(): void {
    this.headerButtonService.updateTemplate(this.buttonsTemplate);
  }
  handleFetchAccreditation() {
    this.accountService.currentAccount.subscribe(accountInfor => {
      if(accountInfor?.uuid) {
        this.currentAccount = accountInfor;
        this.accreditationService.getAccountAccreditations(this.currentAccount.uuid).subscribe(res => {
          const accreditations = res;
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
        })
      }
    })
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

  handleSelectTab(event) {
    this.activeTab = event;
  }

  toggleAccreditation() {
    this.matDrawerAddAccreditation.toggle();
  }

  closeSideNav(param) {
    const { refresh } = param;
    if(refresh) {
      this.handleFetchAccreditation()
    }
    this.toggleAccreditation();
  }

  uploadAvatarToAccount(e) {
    this.accountService
      .updateDetail(this.currentAccount.uuid, { avatar: e.eager[0].secure_url })
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  goToPlan() {
    this.isPlan = true;
  }

  returnToSubscription() {
    this.isPlan = false;
    this.selectedIndex = 1;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  handleRemoveAction(acc) {
    const dialogData = {
      title: "Confirm",
      message: `Are you sure you want to delete this?`
    }

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      maxWidth: "500px",
      height: '170px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.handleRemove(acc);
      }
    });
  }

  handleRemove(acc) {
    this.accreditationService.deleteUserAccreditation(acc.uuid).pipe(
      takeUntil(this.unsubscribeAll),
      catchError(error => {
        this.handleFetchAccreditation()

        return EMPTY;
      })
    ).subscribe(res => {
      this.handleFetchAccreditation()
    })
  }
}
