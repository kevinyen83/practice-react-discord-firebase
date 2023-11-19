import { AccountService } from 'app/core/services/account/account.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { Account } from '../../../../core/services/account/account';

@Component({
  selector: 'app-supplier-compliance',
  templateUrl: './supplier-compliance.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupplierComplianceComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  filterSuppliersForm: FormGroup;
  searchSuppliers: FormControl;
  activeFilter;
  suppliers = [];
  displayedColumns: string[] = [
    'number',
    'photo',
    'identifier',
    'name',
    'tradingname',
    'contactNumber',
    'address',
    'logo',
    'complianceIssues',
    'lastUpdated'
  ];
  selectedFilters = {
    compliant: [],
    email: [],
    phoneNumber: [],
    logo: [],
    address: [],
    complianceIssues: []
  };
  currentAccount: any = {};
  dataSource: MatTableDataSource<Account>;

  private unsubscribeAll = new Subject();

  constructor(private suppliersService: SuppliersService, private formBuilder: FormBuilder, private router: Router, private accountService: AccountService) {
    this.searchSuppliers = new FormControl('');
  }

  ngOnInit() {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.createFilterSuppliersForm();
    this.accountService.currentAccount
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        this.currentAccount = res;
        this.suppliers = this.currentAccount.suppliers || [];
        this.dataSource = new MatTableDataSource(this.suppliers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  createFilterSuppliersForm() {
    this.filterSuppliersForm = this.formBuilder.group({
      compliant: [''],
      email: [''],
      contactNumber: [''],
      logo: [''],
      address: [''],
      complianceIssues: ['']
    });
  }

  onChangeFilter(filter: string, event) {
    this.activeFilter = event.value;
    localStorage.setItem('filter', this.activeFilter);
    this.selectedFilters[filter] = event.value;
    this.assignCopy();
  }

  applyFiltering() {
    const predicates = this.Predicates;
    const result = this.suppliers.filter((supplier) => predicates.every((predicate) => predicate(supplier)));
    this.dataSource = new MatTableDataSource<any>([...result]);
  }

  private get Predicates(): Array<any> {
    const filters = this.selectedFilters;
    return Object.keys(filters).map((name: string) => {
      if (Array.isArray(filters[name]) && filters[name].length) {
        return (item) =>
          filters[name].some((value) => {
            if (value === 'Yes') {
              return item[name] !== '' || item[name] !== null || item[name] === 'Yes';
            } else {
              return item[name] === '' || item[name] === null || item[name] === 'No';
            }
          });
      }
      return (t) => true;
    });
  }

  assignCopy() {
    this.dataSource.filteredData = [...this.suppliers];
  }

  sortData(sort: Sort) {
    const data = this.suppliers.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = new MatTableDataSource(data);
      return;
    }
    this.dataSource = new MatTableDataSource(
      data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'number':
            return this.compare(data.indexOf(a), data.indexOf(b), isAsc);
          case 'photo':
            return this.compare(data.indexOf(a), data.indexOf(b), isAsc);
          case 'identifier':
            return this.compare(a.identifier, b.identifier, isAsc);
          case 'name':
            return this.compare(a.name, b.name, isAsc);
          case 'tradingname':
            return this.compare(a.tradingname, b.tradingname, isAsc);
          case 'contactNumber':
            return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
          case 'address':
            return this.compare(a.address, b.address, isAsc);
          case 'complianceIssues':
            return this.compare(a.complianceIssues, b.complianceIssues, isAsc);
          case 'lastUpdated':
            return this.compare(a.date2, b.date2, isAsc);
          default:
            return 0;
        }
      })
    );
  }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  toEditSupplier(row) {
    this.suppliers.forEach((supplier) => {
      if (supplier.id === row.id) {
        supplier.status = 'compliance';
      }
    });
    this.suppliersService.addSupplier(this.currentAccount.uuid, this.suppliers);
    const findSupplier = this.suppliers.find((supplier) => supplier.id === row.id);
    this.router.navigate([`/pages/list-suppliers/${findSupplier.id}`]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
