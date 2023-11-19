import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, Subject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { fuseAnimations } from '@fuse/animations';
import { ClientsService } from 'app/core/services/client/clients.service';
import { Account } from '../../../../core/services/account/account';
import { AccountService } from 'app/core/services/account/account.service';
import { ExcelService } from '../../roster/excel.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { RosterService } from '../../../../core/services/roster/roster.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { environment } from 'environments/environment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UtilService } from 'app/core/services/utils/util.service';
import { MatDrawer } from '@angular/material/sidenav';


const moment = extendMoment(Moment);

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ListClientsComponent implements OnInit, OnDestroy {
  // @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('matDrawerClient') matDrawerClient;
  selectedValue = new Subject<number>();
  // @ViewChild('matDrawerFilterClient') matDrawerFilterClient: FuseDrawerModule;

  activeFilter: string;
  filterClientsForm: FormGroup;
  dataSourceClients: MatTableDataSource<Account[]>;
  searchAbn: FormControl;
  clients = [];
  viewInviteClient = false;
  viewCreateClient = false;
  statusForm: string;
  currentClient;
  currentUuid;
  currentAccount;
  clientStatus: string;
  spinnerSearch = false;
  states = [
    'NSW',
    'VIC',
    'QLD',
    'ACT',
    'SA',
    'WA',
    'TAS',
    'NT'
  ];
  displayedColumns: string[] = [
    'name',
    'tradingname',
    'industry',
    'phoneNumber',
    'complianceStatus',
    'connectionStatus',
    'activeLink'
  ];
  statuses = [
    'Active',
    'Pending',
    'Inactive',
  ];
  selectedFilters = {
    state: [],
    primary: [],
    profileStatus: [],
    connectionStatus: []
  };
  allClients = [];
  profile;
  isAdmin;
  notificationABN: string;
  entityName;
  entitytype;
  tradingname;
  acn;
  currentFilter: string;
  defaultAvatar;
  // tasks = [];
  selects = [];
  addAbnActive = false;
  claimedAccount = false;
  tenant = environment.tenant;
  selectedValuesString = [];
  selectedValuesObject = [];
  selectedValuesManaged = [];
  currentAccountInfo
  selectedValues = [];
  // currentAccountInfo
  private unsubscribeAll = new Subject();
  reserveClients = [];
  filteredValue;
  drawerMode = 'side';
drawerOpened = false;
    constructor(
    private formBuilder: FormBuilder,
    private clientsService: ClientsService,
    private userProfileService: UserProfileService,
    private complianceService: ComplianceService,
    public accountService: AccountService,
    private route: ActivatedRoute,
    private _fuseConfirmationService: FuseConfirmationService,
    private avatarService: AvatarService,
    private snackBar: MatSnackBar,
    private router: Router,
    public utils: UtilService,

  ) {
    this.searchAbn = new FormControl('');
  }

  ngOnInit(): void {
        this.currentAccountInfo = this.accountService?.currentAccount?._value?.payment_instruments
    // this.currentAccountInfo = this.accountService?.currentAccount?._value?.payment_instruments
    this.defaultAvatar = this.avatarService.defaultAvatar;
    // this.createFilterClientsForm();
    this.accountService.currentAccount
      .pipe(
        switchMap((res: any) => {
          this.currentAccount = res;
          this.currentUuid = this.currentAccount?.uuid;
          this.clients = this.currentAccount?.clients || [];
          this.allClients = [...this.clients];
          this.dataSourceClients = new MatTableDataSource<any[]>(this.clients);
          return this.userProfileService.currentUser;
        }),
        tap((res) => {
          this.profile = res;
          this.isAdmin = this.accountService.isAdmin;
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        /// TODO: Remove tasks here, why is it needed
        // this.tasks = res;
        this.compileView();
      });
    // this.searchAbn.valueChanges.subscribe((res) => {
    //   this.addAbnActive = false;
    //   this.notificationABN = '';
    //   this.entityName = '';
    //   this.entitytype = '';
    //   this.tradingname = '';
    //   this.acn = '';
    // });
  }

toggleDrawerOpen(): void {
    this.drawerOpened = !this.drawerOpened;
}
/**
 * Drawer opened changed
 *
 * @param opened
 */
drawerOpenedChanged(opened: boolean): void
{
    this.drawerOpened = opened;
}
  // searchingAbn() {
  //   this.spinnerSearch = true;
  //   const abn = this.searchAbn.value;
  //   if (abn) {
  //     const newAbn = abn.split(' ').join('').split('-').join('');
  //     if (newAbn.length > 11) {
  //       this.searchAbn.setErrors({ invalid: true });
  //       this.notificationABN = 'Invalid ABN';
  //       this.spinnerSearch = false;
  //       return;
  //     }

  //     this.complianceService
  //       .verifyComplianceDetails('abn', newAbn)
  //       .pipe(
  //         tap((res) => {
  //           if (res.Abn === '') {
  //             this.searchAbn.setErrors({ invalid: true });
  //             this.notificationABN = 'ABN is not found';
  //             this.addAbnActive = false;
  //             this.spinnerSearch = false;
  //           } else {
  //             this.searchAbn.patchValue(newAbn);
  //             this.entityName = res.EntityName;
  //             this.entitytype = res.EntityTypeName;
  //             this.acn = res.Acn;
  //             if (res.BusinessName[0]) {
  //               this.tradingname = res.BusinessName[0];
  //             }
  //             this.clientsService.abnInfo = this.getABNInfo();
  //             this.claimedAccount = true;
  //             this.addAbnActive = true;
  //             this.spinnerSearch = false;
  //             this.searchAbn.setErrors(null);
  //           }
  //         }),
  //         takeUntil(this.unsubscribeAll),
  //         catchError((err) => {
  //           console.log(err);
  //           return EMPTY;
  //         })
  //       )
  //       .subscribe(
  //         () => {},
  //         (err) => {
  //           this.entityName = '';
  //           this.entitytype = '';
  //           this.acn = '';
  //           this.addAbnActive = false;
  //           this.spinnerSearch = false;
  //         }
  //       );
  //   } else {
  //     this.entityName = '';
  //     this.entitytype = '';
  //     this.acn = '';
  //     this.addAbnActive = false;
  //     this.spinnerSearch = false;
  //   }
  // }

  deleteClient(client) {
    this.clients = this.clients.filter((cl) => cl.uuid !== client.uuid);
  }

  // getABNInfo() {
  //   return {
  //     entityName: this.entityName,
  //     entitytype: this.entitytype,
  //     acn: this.acn,
  //     tradingname: this.tradingname || '',
  //     abn: this.searchAbn.value
  //   };
  // }

  removeClient(row) {
    // const client = this.tasks.find(
    //   (t) => t.client.profile_name === row.detail.name
    // );
    // if (client) {
    // const data = {
    //   title: "Can not remove Client.",
    //   message:
    //     "This Client can not be removed because there are tasks associated with it",
    //   buttons: [
    //     {
    //       color: "accent",
    //       title: "Ok",
    //       value: false,
    //     },
    //   ],
    // };

    // this error would be controlled by the server not the frontend
    // const dialogRef = this._fuseConfirmationService.open({
    //   title: `Can not remove Client.`,
    //   message: `This Client can not be removed because there are tasks associated with it`,
    //   actions: {
    //     confirm: {
    //       show: true,
    //       label: 'Ok',
    //       color: 'primary'
    //     }
    //   }
    // });

    // const dialogRef = this.dialog.open(ConfirmActionComponent, {
    //   data,
    // });
    // } else {
    // const data = {
    //   title: "Remove Client?",
    //   message: "Removing the Client will break the link with them.",
    //   buttons: [
    //     {
    //       color: "accent",
    //       title: "Cancel",
    //       value: false,
    //     },
    //     {
    //       color: "accent",
    //       title: "Continue",
    //       value: true,
    //     },
    //   ],
    // };
    const dialogRef = this._fuseConfirmationService.open({
      title: `Remove Client?`,
      message: `Removing the Client will break the link with them.`,
      actions: {
        confirm: {
          show: true,
          label: 'Continue',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.clients = this.clients.filter((cl) => cl.uuid !== row.uuid);
        this.dataSourceClients = new MatTableDataSource<Account[]>(this.clients);
      }
    });
    // }
  }

  compileView() {
    this.dataSourceClients = new MatTableDataSource<any[]>(this.clients);
    const data = this.clients.slice();
    // this.dataSource = new MatTableDataSource(data.sort((a, b) => {
    //     return this.compare(a.detail.name.toLowerCase(), b.detail.name.toLowerCase(), true);
    // }));
    // this.dataSourceClients.paginator = this.paginator;
    this.dataSourceClients.sort = this.sort;
    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        // if (!res.id) {
        //   this.viewCreateClient = false;
        // }
        // if (res.id) {
        //   this.currentClient = this.clients.find((supplier) => supplier.id.toString() === res.id);
        //   this.editRosterClient(this.currentClient);
        // }
      });
    if (localStorage.getItem('filterListClients')) {
      this.selectedFilters = JSON.parse(localStorage.getItem('filterListClients'));
      for (const filter in this.selectedFilters) {
        if (this.selectedFilters[filter].length) {
          this.filterClientsForm.get(filter).patchValue(this.selectedFilters[filter]);
        }
      }
      this.applyFiltering();
    }
  }

  // onChangeFilter(filter: string, event): void {
  //   this.activeFilter = event.value;
  //   this.selectedFilters[filter] = event.value;
  //   localStorage.setItem(
  //     "filterListClients",
  //     JSON.stringify(this.selectedFilters)
  //   );
  //   this.assignCopy();
  // }

  assignCopy(): void {
    this.dataSourceClients.filteredData = [...this.clients];
  }

  updateListClients(event) {
    if(typeof event.value ==='string'){
      this.selectedValuesString = event.value;
    }
    if(event.filter === 'status'){
      this.selectedValuesObject = event.value;
    }
    if(event.filter === 'managed'){
      this.selectedValuesManaged = event.value;
    }
  }

  // returnValueFilter(event){
  //   this.selectedValue=[{}]
  // }

  unTickSelectedValue(event){
    this.selectedValue.next(event)
  }

  editClient(row) {
    this.currentClient = row;
    this.router.navigate([`pages/list-clients/${row.uuid}`]);
  }

  // makeDefaultAccount(account) {
  //   // this.userProfileService.makeDefaultAccount(account);
  // }

  // changeAccount(account) {
  //   this.accountService
  //     .setCurrentAccount(account.uuid)
  //     .pipe(
  //       takeUntil(this.unsubscribeAll),
  //       catchError((error) => this.handleError(error))
  //     )
  //     .subscribe((res) => {
  //       this.snackBar.open("Account updated!", "X", {
  //         duration: 2000,
  //         verticalPosition: "top",
  //         horizontalPosition: "center",
  //       });
  //     });
  // }

  handleError(err): any {
    if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
      return throwError(err);
    } else {
      this.snackBar.open('You do not have permission to switch to this profile', 'X', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return EMPTY;
    }
  }

  // editRosterClient(client) {
  //   this.currentClient = client;
  //   this.viewCreateClient = true;
  //   this.statusForm = 'edit';
  //   this.clientStatus = 'roster';
  // }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFiltering() {
    const predicates = this.Predicates;
    const result = this.clients.filter((resource) => predicates.every((predicate) => predicate(resource)));
    this.dataSourceClients = new MatTableDataSource([...result]);
    setTimeout(() => {
      // this.dataSourceClients.paginator = this.paginator;
    });
  }

  private get Predicates(): Array<any> {
    const filters = this.selectedFilters;
    return Object.keys(filters).map((name: string) => {
      if (Array.isArray(filters[name]) && filters[name].length) {
        return (item) => filters[name].some((value) => item[name].toLowerCase() === value.toLowerCase());
      }
      return (t) => true;
    });
  }

  // createFilterClientsForm(): void {
  //   this.filterClientsForm = this.formBuilder.group({
  //     state: [''],
  //     primary: [''],
  //     profileStatus: [''],
  //     connectionStatus: ['']
  //   });
  // }

  // inviteClient() {
  //   this.router.navigate(["pages/list-clients/invite"]);
  // }

  // viewInvite(event) {
  //   this.viewInviteClient = event;
  //   this.ngOnInit();
  // }

  // viewCreate(event) {
  //   this.viewCreateClient = event;
  //   this.router.navigate(["pages/list-clients"], event);
  //   if (this.clientStatus === "roster") {
  //     this.router.navigate(["pages/roster"]);
  //   }
  //   this.ngOnInit();
  // }

  // goToCurrentClient(row) {
  //   window.open(`/pages/list-clients/${row.uuid}`, "_blank");
  // }

  // savePDF() {
  //   html2canvas(document.querySelector(".example-container")).then((canvas) => {
  //     // const pdf = new jsPDF('px', 'pt', [canvas.width, canvas.height]);
  //     //
  //     // const imgData  = canvas.toDataURL('image/jpeg', 1.0);
  //     // const width = pdf.internal.pageSize.getWidth();
  //     // const height = canvas.height * width / canvas.width;
  //     // pdf.addImage(imgData, 0, 0, width, height);
  //     // pdf.save('clients_' + moment().format() + '.pdf');
  //   });
  // }

  // saveXLS() {
  //   const name = "client";
  //   this.excelService.exportAsExcelFile(this.clients, name);
  // }

  createClient() {
    this.matDrawerClient.toggle();
    // this.router.navigate(["pages/list-clients/create"]);
  }

  // createFilter() {
  //   // this.matDrawerFilterClient.toggle();
  //   // this.router.navigate(["pages/list-clients/create"]);
  // }

  openFilters() {
    this.reserveClients = this.clients;
    // this.matDrawerFilterClient.toggle();
  }

  closeSideNav(status) {
    if (status === 'filter') {
      // this.matDrawerFilterClient.toggle();
    }
    // this.clearClients(this.clients);
    // this.updateEvents();
    // this.shiftsForWeek();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
