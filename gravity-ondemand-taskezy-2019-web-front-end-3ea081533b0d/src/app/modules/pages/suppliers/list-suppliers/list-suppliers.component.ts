import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EMPTY, Subject, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { fuseAnimations } from '@fuse/animations';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AccountService } from 'app/core/services/account/account.service';

// import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { ExcelService } from '../../roster/excel.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';

import { HttpErrorResponse } from '@angular/common/http';
import { RosterService } from '../../../../core/services/roster/roster.service';
import { ComplianceService } from 'app/core/services/compliance/compliance.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { environment } from 'environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { Account } from '../../../../core/services/account/account';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UtilService } from 'app/core/services/utils/util.service';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ListSuppliersComponent implements OnInit, OnDestroy {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('matDrawerSupplier') matDrawerSupplier;
  selectedValue = new Subject<number>();

  searchSuppliers: FormControl;
  sorting: FormControl;
  activeFilter: string;
  suppliers: any[] = [];
  dataSourceSuppliers: MatTableDataSource<Account[]>;
  viewInviteSupplier = false;
  viewCreateSupplier;
  statusForm: string;
  currentSupplier: any;
  filterSuppliersForm: FormGroup;
  currentUuid;
  currentAccount;
  allSuppliers = [];
  searchAbn: FormControl;
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
  selectedFilters = {
    state: [],
    profileStatus: [],
    connectionStatus: []
  };
  statusSupplier: string;
  spinnerSearch = false;
  select: FormControl;
  profile;
  tenant = environment.tenant;
  isAdmin;
  notificationABN;
  entityName;
  tradingname;
  entitytype;
  claimedAccount = false;
  statuses = [
    'Active',
    'Pending',
    'Inactive'
  ];
  acn;
  // tasks = [];
  displayedColumns: string[] = [
    'name',
    'tradingname',
    'industry',
    'phoneNumber',
    'complianceStatus',
    'connectionStatus',
    'activeLink'
  ];
  defaultAvatar;
  selects = [];
  selectedValues = [];
  currentFilter: string;
  // currentAccountInfo
  private unsubscribeAll = new Subject();
  drawerMode = 'side';
  drawerOpened = false;
  selectedValuesString = [];
  selectedValuesObject = [];
  selectedValuesManaged = [];
  filteredValue

  constructor(
    private formBuilder: FormBuilder,
    private suppliersService: SuppliersService,
    private userProfileService: UserProfileService,
    public  accountService: AccountService,
    private complianceService: ComplianceService,
    private route: ActivatedRoute,
    private _fuseConfirmationService: FuseConfirmationService,
    private snackBar: MatSnackBar,
    private excelService: ExcelService,
    private router: Router,
    private avatarService: AvatarService,
    public utils: UtilService
  ) {
    this.select = new FormControl('');
    this.searchSuppliers = this.formBuilder.control('');
    this.searchAbn = new FormControl('');
    this.viewCreateSupplier = false;
    this.sorting = new FormControl('Show All');
  }

  ngOnInit() {

    // this.currentAccountInfo = this.accountService?.currentAccount?._value?.payment_instruments
    this.defaultAvatar = this.avatarService.defaultAvatar;
    // this.createFilterSuppliersForm();
    this.accountService.currentAccount
      .pipe(
        takeUntil(this.unsubscribeAll),
        switchMap((res: any) => {
          this.currentAccount = res;
          this.currentUuid = this.currentAccount.uuid;
          this.suppliers = this.currentAccount.suppliers || [];
          this.allSuppliers = [...this.suppliers];
          console.log(this.allSuppliers);
          this.dataSourceSuppliers = new MatTableDataSource<any[]>(this.suppliers);
          return this.userProfileService.currentUser;
        }),
        tap((res) => {
          this.profile = res;
          this.isAdmin = this.accountService.isAdmin;
          // return this.rosterService.getAllShifts();
          // }),
          // tap((res: any[]) => {
          // this.tasks = res;

          // return this.rosterService.getAllShifts();
        }),
        catchError((err) => {
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        /// TODO: Remove tasks here, why is it needed
        // this.tasks = res;
        this.compileView();
      });
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
unTickSelectedValue(event){
  this.selectedValue.next(event)
}

  removeSupplier(row) {
    // const thisSupplier = this.tasks.find(
    //   (t) => t.supplier.profile_name === row.detail.name
    // );
    // if (thisSupplier) {
    // const data = {
    //   title: "Can not remove Supplier?",
    //   message:
    //     "This Supplier can not be removed because there are tasks associated with it.",
    //   buttons: [
    //     {
    //       color: "accent",
    //       title: "Ok",
    //       value: false,
    //     },
    //   ],
    // };

    /// this would be checked by the server, not the frontend

    // const dialogRef = this._fuseConfirmationService.open({
    //   title: 'Can not remove Supplier?',
    //   message: 'This Supplier can not be removed because there are tasks associated with it.',
    //   actions: {
    //     confirm: {
    //         show: true,
    //         label: 'Ok',
    //         color: 'primary'
    //     }
    //   }
    // });
    // const dialogRef = this.dialog.open(ConfirmActionComponent, {
    //   data,
    // });
    // } else {
    // const data = {
    //   title: "Remove Supplier?",
    //   message: "Removing the Supplier will break the link with them.",
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
      title: 'Remove Supplier?',
      message: 'Removing the Supplier will break the link with them.',
      actions: {
        confirm: {
          show: true,
          label: 'continue',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    });
    // const dialogRef = this.dialog.open(ConfirmActionComponent, {
    //   data,
    // });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.suppliers = this.suppliers.filter((sup) => sup.uuid !== row.uuid);
        this.dataSourceSuppliers = new MatTableDataSource<any[]>(this.suppliers);
      }
    });
    // }
  }

  updateListSuppliers(event) {
    // this.currentFilter = event.filter;
    // this.selectedValues = event.value;
    if(typeof event.value ==='string'){
      this.selectedValuesString = event.value;
    }
    if(event.filter === 'status'){
      this.selectedValuesObject = event.value;
    }
  }


  compileView() {
    this.dataSourceSuppliers = new MatTableDataSource<any[]>(this.suppliers);
    if (localStorage.getItem('filterListSuppliers')) {
      this.selectedFilters = JSON.parse(localStorage.getItem('filterListSuppliers'));
      for (const filter in this.selectedFilters) {
        if (this.selectedFilters[filter].length) {
          this.filterSuppliersForm.get(filter).patchValue(this.selectedFilters[filter]);
        }
      }
      this.applyFiltering();
    }
    this.searchSuppliers.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe((value) => {
      const data = this.suppliersService.searchSuppliers([...this.suppliers], value);
      this.dataSourceSuppliers = data || [];
    });
    // this.route.queryParams.pipe(takeUntil(this.unsubscribeAll)).subscribe((res) => {
    //   if (!res.id) {
    //     this.viewCreateSupplier = false;
    //   }
    //   if (res.id) {
    //     if (res.status === 'roster') {
    //       this.currentSupplier = this.suppliers.find((s) => s.id === +res.id);
    //       this.editSupplierRoster(this.currentSupplier);
    //     }
    //   }
    // });
  }

  changeProfile(profile) {
    this.accountService
      .setCurrentAccount(profile.uuid)
      .pipe(
        // takeUntil(this.unsubscribeAll),
        catchError((error) => this.handleError(error))
      )
      .subscribe((res) => {
        this.snackBar.open('Profile updated!', 'X', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      });
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
  //             // this.addAbnActive = false;
  //             this.spinnerSearch = false;
  //           } else {
  //             this.notificationABN = '';
  //             this.searchAbn.patchValue(newAbn);
  //             this.entityName = res.EntityName;
  //             this.entitytype = res.EntityTypeName;
  //             this.acn = res.Acn;
  //             if (res.BusinessName[0]) {
  //               this.tradingname = res.BusinessName[0];
  //             }
  //             this.suppliersService.abnInfo = this.getABNInfo();
  //             this.claimedAccount = true;
  //             // this.addAbnActive = true;
  //             this.spinnerSearch = false;
  //             this.searchAbn.setErrors(null);
  //           }
  //         }),
  //         takeUntil(this.unsubscribeAll),
  //         catchError((err) => {
  //           console.log(err);
  //           this.entityName = '';
  //           this.entitytype = '';
  //           this.acn = '';
  //           // this.addAbnActive = false;
  //           this.spinnerSearch = false;
  //           return EMPTY;
  //         })
  //       )
  //       .subscribe((res) => {});
  //   } else {
  //     this.entityName = '';
  //     this.entitytype = '';
  //     this.acn = '';
  //     // this.addAbnActive = false;
  //     this.spinnerSearch = false;
  //   }
  // }

  // onABNChange() {
  //   this.notificationABN = '';
  // }

  // getABNInfo() {
  //   return {
  //     entityName: this.entityName,
  //     entitytype: this.entitytype,
  //     acn: this.acn,
  //     tradingname: this.tradingname || '',
  //     abn: this.searchAbn.value
  //   };
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

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // createFilterSuppliersForm() {
  //   this.filterSuppliersForm = this.formBuilder.group({
  //     state: [''],
  //     profileStatus: [''],
  //     connectionStatus: ['']
  //   });
  // }

  // inviteSupplier() {
  //   this.router.navigate(['pages/list-suppliers/invite']);
  // }

  inviteView(event) {
    this.viewInviteSupplier = event;
    this.ngOnInit();
  }

  // createView(event) {
  //   this.viewCreateSupplier = event;
  //   this.router.navigate(['pages/list-suppliers'], event);
  //   this.ngOnInit();
  // }


  editSupplier(row) {
    this.currentSupplier = row;
    this.router.navigate([`pages/list-suppliers/${row.uuid}`]);
  }

  makeDefaultAccount(account) {
    this.userProfileService.makeDefaultAccount(account);
  }

  // editSupplierCompliance(supplier) {
  //   this.statusForm = 'edit';
  //   this.viewCreateSupplier = true;
  //   this.currentSupplier = supplier;
  //   this.statusSupplier = 'compliance';
  // }

  // editSupplierRoster(element) {
  //   this.statusForm = 'edit';
  //   this.viewCreateSupplier = true;
  //   this.currentSupplier = element;
  //   this.statusSupplier = 'roster';
  // }

  applyFiltering() {
    const predicates = this.Predicates;
    const result = this.suppliers.filter((resource) => predicates.every((predicate) => predicate(resource)));
    this.dataSourceSuppliers = new MatTableDataSource([...result]);
    setTimeout(() => {
      this.dataSourceSuppliers.paginator = this.paginator;
    });
  }

  private get Predicates(): Array<any> {
    const filters = this.selectedFilters;
    return Object.keys(filters).map((name: string) => {
      if (Array.isArray(filters[name]) && filters[name].length) {
        return (item) => filters[name].some((value) => item[name] === value);
      }
      return (t) => true;
    });
  }

  onChangeFilter(event, filter: string) {
    this.activeFilter = event.value;
    this.selectedFilters[filter] = event.value;
    localStorage.setItem('filterListSuppliers', JSON.stringify(this.selectedFilters));
    // this.assignCopy();
  }

  // assignCopy() {}

  // goToCurrentSupplier(row) {
  //   window.open(`/pages/list-suppliers/${row.uuid}`, '_blank');
  // }

  savePDF() {
    html2canvas(document.querySelector('.example-container')).then((canvas) => {
      // const pdf = new jsPDF('px', 'pt', [canvas.width, canvas.height]);
      //
      // const imgData  = canvas.toDataURL('image/jpeg', 1.0);
      // const width = pdf.internal.pageSize.getWidth();
      // const height = canvas.height * width / canvas.width;
      // pdf.addImage(imgData, 0, 0, width, height);
      // pdf.save('suppliers_' + moment().format() + '.pdf');
    });
  }

  saveXLS() {
    const name = 'supplier';
    this.excelService.exportAsExcelFile(this.suppliers, name);
  }

  createSupplier() {
    this.matDrawerSupplier.toggle();
    // this.router.navigate(["pages/list-suppliers/create"]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
