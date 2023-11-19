import { AccountService } from "app/core/services/account/account.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserData } from "../resource-interviews/resource-interviews.component";
import { SuppliersService } from "app/core/services/supplier/suppliers.service";
import { FormControl } from "@angular/forms";
import { ResourcesService } from "app/core/services/resource/resources.service";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { EMPTY, Subject } from "rxjs";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RequestsComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  users;
  searchResources: FormControl;
  resources = [];
  foundResources = [];
  sentRequestsResources = [];
  receivedConnections = [];
  message: string;
  currentAccount: any = {};
  classError = false;
  notificationError: string;
  displayedColumns: string[] = [
    "number",
    "name",
    "preferredName",
    "primaryResourceType",
    "primaryAccreditationNumber",
    "state",
    "statusConnection",
    "button",
  ];
  displayedColumnsReceived: string[] = [
    "number",
    "name",
    "preferredName",
    "primaryResourceType",
    "primaryAccreditationNumber",
    "state",
    "sentBy",
  ];
  dataSource: MatTableDataSource<UserData>;
  dataReceived: MatTableDataSource<UserData>;

  unsubscribeAll = new Subject<any>();

  constructor(
    private suppliersService: SuppliersService,
    private listResourceService: ResourcesService,
    private accountService: AccountService
  ) {
    this.searchResources = new FormControl("");
  }

  ngOnInit() {
    this.accountService.currentAccount
      .pipe(
        tap((res) => {
          this.currentAccount = res;
          this.resources = this.currentAccount.resources || [];
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();

    this.dataSource = new MatTableDataSource(this.sentRequestsResources);
    this.dataReceived = new MatTableDataSource(this.receivedConnections);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataReceived.paginator = this.paginator;
    this.dataReceived.sort = this.sort;
  }

  searchingResources(value) {
    let searchText = value;
    if (searchText === "") {
      this.foundResources = [];
    } else {
      searchText = searchText.toLowerCase();
      this.foundResources = this.resources.filter((resource) =>
        resource.name.toLowerCase().toString().includes(searchText)
      );
    }
  }

  sendConnectionRequests(supplier) {
    const repeatSent = this.sentRequestsResources.find(
      (request) => request.id === supplier.id
    );
    const repeatReceived = this.receivedConnections.find(
      (request) => request.id === supplier.id
    );
    if (repeatSent || repeatReceived) {
      this.message = "Request was send earlier";
      this.classError = true;
    } else {
      this.classError = false;
      this.sentRequestsResources.push(supplier);
      this.message = "Connection Request Sent Successfully";
    }
    this.ngOnInit();
    this.foundResources = [];
    this.searchResources.patchValue("");
  }

  closeMessage() {
    this.message = null;
  }

  cancelConnectionRequest(element) {
    this.sentRequestsResources = this.sentRequestsResources.filter(
      (request) => request.id !== element.id
    );
    this.ngOnInit();
  }

  resendSupplier(element) {
    const findEl = this.receivedConnections.find((el) => el.id === element.id);
    if (findEl) {
      this.notificationError = "Such supplier was send!";
    } else {
      // this.receivedConnections.push(element);
      this.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
