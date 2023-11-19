import { AccountService } from 'app/core/services/account/account.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { fuseAnimations } from '@fuse/animations';
import { UserData } from '../../resources/resource-interviews/resource-interviews.component';
import { ClientsService } from 'app/core/services/client/clients.service';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-client-requests',
  templateUrl: './client-requests.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ClientRequestsComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  currentAccount: any = {};
  searchClients: FormControl;
  users;
  clients = [];
  suppliers = [];
  foundUsers = [];
  message: string;
  classError = false;
  sentRequestsSuppliers = [];
  receivedConnections = [];
  notificationError: string;
  dataReceived: MatTableDataSource<UserData>;
  displayedColumnsReceived = [
    'number',
    'identifier',
    'name',
    'tradingname',
    'abn',
    'state'
  ];
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
  dataSource: MatTableDataSource<UserData>;

  unsubscribeAll = new Subject<any>();

  constructor(private clientsService: ClientsService, private suppliersService: SuppliersService, private accountService: AccountService) {
    this.searchClients = new FormControl('');
  }

  ngOnInit() {
    this.accountService.currentAccount
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((currAccount) => {
        this.currentAccount = currAccount;
        this.clients = this.currentAccount.clients || [];
        this.suppliers = this.currentAccount.suppliers || [];

        this.users = [
          ...this.clients,
          ...this.suppliers
        ];
        this.dataSource = new MatTableDataSource(this.sentRequestsSuppliers);
        this.dataReceived = new MatTableDataSource(this.receivedConnections);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataReceived.paginator = this.paginator;
        this.dataReceived.sort = this.sort;
      });
  }

  searchingClients(value) {
    let searchText = value;
    if (searchText === '') {
      this.foundUsers = [];
    } else {
      searchText = searchText.toLowerCase();
      this.foundUsers = this.users.filter((user) => user.identifier.toLowerCase().toString().includes(searchText));
    }
  }

  sendConnectionRequests(supplier) {
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
    this.foundUsers = [];
    this.searchClients.patchValue('');
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
      this.receivedConnections.push(element);
      this.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
