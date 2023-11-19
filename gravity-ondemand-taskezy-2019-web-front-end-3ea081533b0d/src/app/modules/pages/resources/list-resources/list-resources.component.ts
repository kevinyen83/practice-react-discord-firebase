import { Component, OnChanges, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
// import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

import { fuseAnimations } from '@fuse/animations';
import { ExcelService } from '../../roster/excel.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { AccountService } from 'app/core/services/account/account.service';

import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { environment } from 'environments/environment';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FuseConfirmationConfig, FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { InviteMembersFormArrayComponent } from 'app/modules/common/invite-members-form-array/invite-members-form-array.component';
import { UtilService } from 'app/core/services/utils/util.service';
const moment = extendMoment(Moment);

@Component({
  selector: 'app-list-resources',
  templateUrl: './list-resources.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ListResourcesComponent implements OnInit, OnDestroy, OnChanges {
  // @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('sorting') sorting = new MatSort();
  @ViewChild(InviteMembersFormArrayComponent) inviteList: InviteMembersFormArrayComponent;

  searchResources: FormControl;
  states = [
    'ACT',
    'NSW',
    'QLD',
    'VIC',
    'WA',
    'SA',
    'TAS',
    'NT'
  ];
  defaultAvatar;
  currentResource;
  statusForm: string;
  currentAccount;
  viewCreateResource = false;
  dataSource: MatTableDataSource<any>;
  viewInviteResource = false;
  activeFilter;
  allResources = [];
  profiles = [];
  selectedFilters = {
    state: [],
    profileStatus: [],
    supplierConnections: [],
    connectionStatus: []
  };
  profile;
  isAdmin;
  statusResource: string;
  tenant = environment.tenant;
  unsubscribeAll = new Subject<any>();

  addResourceForm: FormGroup = new FormGroup({});
  displayedColumns = [
    'pic',
    'name',
    'supplier',
    'email',
    'phone',
    'status',
    'controls'
  ];
  currentFilter;
  selectedValues = [];

  // roles = [
  //   { label: 'Resource', value: 0 },
  //   { label: 'Manager', value: 1 },
  //   { label: 'Assistant', value: 2 },
  //   { label: 'Administrator', value: 3 }
  // ]

  resources = [];
  invites = [];

  constructor(
    private formBuilder: FormBuilder,
    private resourcesService: ResourcesService,
    private accountService: AccountService,
    private avatarService: AvatarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private excelService: ExcelService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public utils: UtilService
  ) {
    this.searchResources = this.formBuilder.control('');
    this.defaultAvatar = this.avatarService.defaultAvatar;
  }

  ngOnInit() {
    this.accountService.currentAccount
      .pipe(
        switchMap((res) => {
          // TODO: got to get connected-resources too
          this.currentAccount = res;
          if (this.currentAccount.uuid) {
            if (this.currentAccount.resources) {
              this.resources =
                this.currentAccount.resources.map((mem) => {
                  mem.supplier = { name: 'Direct' };
                  return mem;
                }) || [];
            }

            if (this.currentAccount.invitations) {
              this.invites =
                this.currentAccount.invitations.map((mem) => {
                  mem.supplier = { name: 'Direct' };
                  return mem;
                }) || [];
            }
          }
          // this.members = this.currentAccount.members;
          // this.invites = this.currentAccount.invitations;
          return this.accountService.connectedResources;
        }),
        tap((res: any) => {
          if (this.currentAccount.uuid) {
            // let confirmedResources = res.filter((r) => r.supplier.uuid === this.currentAccount.uuid);
            let arrayOfMembers = [
              ...this.resources,
              ...this.invites.filter((m) => m.status !== 1),
              // ...confirmedResources
            ];
            // arrayOfMembers = arrayOfMembers.filter((m) => m.status !== 1);
            this.allResources = arrayOfMembers;
            this.dataSource = new MatTableDataSource<any>(arrayOfMembers);
            this.dataSource.sort = this.sorting;
          }
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  ngOnChanges() {}

  updateListResources(filter) {
    this.currentFilter = filter.filter;
    this.selectedValues = filter.value;
    this.dataSource.filter = JSON.stringify(this.selectedValues);
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data, filter: string): boolean {
      let searchString = JSON.parse(filter);
      if (!searchString || !searchString.length) {
        return true;
      }
      return searchString.indexOf(data.name) !== -1 || searchString.indexOf(data.status) !== -1;
    };
    return myFilterPredicate;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  editResource(resource) {
    if (!resource.date_invited) {
      this.resourcesService.currentResource = resource;
      this.router.navigate([`/pages/list-resources/${resource.user_id}`]);
    }
  }

  addInvite() {
    this.inviteList.addInvite();
    // this.resourcesService.countInvite++;
    // this.resourcesService.invitedMembers.next(this.resourcesService.countInvite);
  }

  resendInvite(invite) {
    const data: FuseConfirmationConfig = {
      title: 'Resend Invitation',
      message: 'Do you want to resend the invitation?',
      icon: {
        show: false
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    };
    let dialog = this._fuseConfirmationService.open(data);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        this.accountService
          .deleteInviteUserToAccount(invite.account_uuid, invite.email)
          .pipe(
            switchMap(() =>
              this.accountService.inviteUserToAccount(invite.account_uuid, invite.email, {
                name: invite.name,
                role: invite.role,
                message: `Hi, Come and join us at ${invite.account_name}`,
                department: invite.department
              })
            ),
            switchMap(() => {
              return this.accountService.setCurrentAccount(this.currentAccount.uuid);
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe();
      }
    });
  }

  cancelInvite(invite) {
    const data: FuseConfirmationConfig = {
      title: 'Delete Invitation',
      message: 'Are you sure you want to delete the invitation for this Resource?',
      icon: {
        show: false
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    };
    let dialog = this._fuseConfirmationService.open(data);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        this.accountService
          .deleteInviteUserToAccount(invite.account_uuid, invite.email)
          .pipe(
            tap(() => {
              this.accountService.setCurrentAccount(this.currentAccount.uuid).subscribe();
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe();
      }
    });
  }

  savePDF() {
    html2canvas(document.querySelector('.table')).then((canvas) => {
      // const pdf = new jsPDF('px', 'pt', [canvas.width, canvas.height]);
      // const imgData  = canvas.toDataURL('image/jpeg', 1.0);
      // const width = pdf.internal.pageSize.getWidth();
      // const height = canvas.height * width / canvas.width;
      // pdf.addImage(imgData, 0, 0, width, height);
      // pdf.save('resources_' + moment().format() + '.pdf');
    });
  }

  saveXLS() {
    const name = 'resource';
    this.excelService.exportAsExcelFile(this.allResources, name);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
