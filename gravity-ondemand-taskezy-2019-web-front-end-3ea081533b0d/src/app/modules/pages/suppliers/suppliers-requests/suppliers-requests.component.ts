import { EMPTY, Subject, zip } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AccountService } from 'app/core/services/account/account.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { Account } from '../../../../core/services/account/account';
import { ClientsService } from 'app/core/services/client/clients.service';

@Component({
  selector: 'app-suppliers-requests',
  templateUrl: './suppliers-requests.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SuppliersRequestsComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  searchSuppliers: FormControl;
  foundSuppliers = [];
  clients = [];
  sendingRequestsToSuppliersClients = [];
  message: string;
  notificationError: string;
  suppliers: Account[] = [];
  sentRequestsSuppliers = [];
  receivedConnections = [];
  displayedColumnsReceived: string[] = [
    'number',
    'identifier',
    'name',
    'tradingname',
    'abn',
    'state',
    'button'
  ];
  dataReceived: MatTableDataSource<Account>;
  displayedColumns: string[] = [
    'number',
    'identifier',
    'name',
    'tradingname',
    'abn',
    'state',
    'connectionStatus',
    'button'
  ];
  dataSource: MatTableDataSource<Account>;
  classError = false;
  currentUser: any = {};

  unsubscribeAll = new Subject<any>();

  constructor(private suppliersService: SuppliersService, private clientsService: ClientsService, private accountService: AccountService) {
    this.searchSuppliers = new FormControl('');
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.sentRequestsSuppliers);
    this.dataReceived = new MatTableDataSource(this.receivedConnections);
    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          this.currentUser = res;
          this.suppliers = res.suppliers || [];
          this.clients = res.client || [];
          this.sendingRequestsToSuppliersClients = [
            ...this.suppliers,
            ...this.clients
          ];
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataReceived.paginator = this.paginator;
    this.dataReceived.sort = this.sort;
  }

  searchingSuppliers(event) {
    let searchText = event;
    if (searchText === '') {
      this.foundSuppliers = [];
    } else {
      searchText = searchText.toLowerCase();
      this.foundSuppliers = this.sendingRequestsToSuppliersClients.filter((user) => user.identifier.toLowerCase().toString().includes(searchText));
    }
  }

  sendConnectionRequests(supplier): void {
    const repeatSent = this.sentRequestsSuppliers.find((request) => request.id === supplier.id);
    const repeatReceived = this.receivedConnections.find((request) => request.id === supplier.id);
    if (repeatSent || repeatReceived) {
      this.message = 'Request was send earlier';
      this.classError = true;
    } else {
      this.classError = false;
      this.sentRequestsSuppliers.push(supplier);
      this.message = 'Connection Request Sent Successfully';
    }
    this.ngOnInit();
    this.foundSuppliers = [];
    this.searchSuppliers.patchValue('');
  }

  closeMessage() {
    this.message = null;
  }

  cancelConnectionRequest(element) {
    this.sentRequestsSuppliers = this.sentRequestsSuppliers.filter((request) => request.id !== element.id);
    this.ngOnInit();
  }

  resendSupplier(element) {
    const findEl = this.receivedConnections.find((el) => el.id === element.id);
    if (findEl) {
      this.notificationError = 'Such supplier was send!';
    } else {
      this.ngOnInit();
    }
  }

  rejectReceived(element) {
    this.receivedConnections = this.receivedConnections.filter((received) => received.id !== element.id);
    this.ngOnInit();
  }

  acceptSupplier(element) {
    this.receivedConnections = this.receivedConnections.filter((received) => received.id !== element.id);
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
