import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { combineLatest, EMPTY, Subject } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { AccountService } from "app/core/services/account/account.service";
import { AvatarService } from "app/core/services/avatar/avatar.service";

import { ResourcesService } from "app/core/services/resource/resources.service";

@Component({
  selector: "app-resource-pool",
  templateUrl: "./resource-pool.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ResourcePoolComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  resourcePoolForm: FormGroup;
  searchResources: FormControl;
  dataSource: MatTableDataSource<any>;
  resourcePool = [];
  reserveResourcePool = [];
  listProfiles = [];
  defaultAvatar;
  accountUsers = [];
  currentUuid;
  currentAccount;
  invitations = [];
  selectedFilters = {
    name: "",
    accreditation: "",
    rating: "",
  };
  unsubscribeAll = new Subject<any>();
  displayedColumns = [
    "avatar",
    "name",
    "accreditation",
    "address",
    "rating",
    "menu",
  ];

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private resourcesService: ResourcesService,
    private avatarService: AvatarService,
  ) {
    this.searchResources = this.formBuilder.control("");
  }

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.buildFormFilters();
    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          this.currentAccount = res;
          this.resourcePool = [...this.currentAccount.resources];
          this.currentUuid = localStorage.getItem("currentAccount");
          // this.currentAccount = this.listProfiles.find(
          //   (p) => p.uuid === this.currentUuid
          // );
          this.currentAccount.suppliers.map((sup) => {
            if (sup.resources && sup.resources.length) {
              this.resourcePool = [...this.resourcePool, ...sup.resources];
            }
          });
          if (this.currentAccount && this.currentAccount.uuid) {
            this.accountService.getAdmins(this.currentAccount.uuid);
          }
          this.invitations = this.currentAccount.invitations;
          setTimeout(() => {
            this.resourcePool.forEach((resource) => {
              resource["rating"] = this.getRandomNumber(1, 6);
            });
            this.reserveResourcePool = [...this.resourcePool];
            this.dataSource = new MatTableDataSource<any>(this.resourcePool);
            this.dataSource.paginator = this.paginator;
          });
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.searchResources.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        const data = this.resourcesService.searchResources(
          [...this.resourcePool],
          value
        );
        this.dataSource = new MatTableDataSource<any[]>(
          data.sort((a, b) =>
            this.compare(
              a.detail.name.toLowerCase(),
              b.detail.name.toLowerCase(),
              true
            )
          )
        );
        this.dataSource.paginator = this.paginator;
        if (value === "") {
          this.dataSource = new MatTableDataSource<any[]>(this.resourcePool);
          this.dataSource.paginator = this.paginator;
        }
      });
    this.resourcePoolForm
      .get("name")
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.selectedFilters["name"] = value;
      });
    this.resourcePoolForm
      .get("accreditation")
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.selectedFilters["accreditation"] = value;
      });
    this.resourcePoolForm
      .get("rating")
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.selectedFilters["rating"] = value;
      });
  }

  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  counter(i: number) {
    return new Array(i);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  handleFilter() {
    const predicates = this.Predicates;
    const result = this.resourcePool.filter((resource) =>
      predicates.every((predicate) => predicate(resource))
    );
    if (result && result.length) {
      this.resourcePool = result;
    } else {
      this.resourcePool = [];
    }
    if (
      !this.selectedFilters.name &&
      !this.selectedFilters.accreditation &&
      !this.selectedFilters.rating
    ) {
      this.resourcePool = this.reserveResourcePool;
    }
    this.dataSource = new MatTableDataSource<any>(this.resourcePool);
    this.dataSource.paginator = this.paginator;
  }

  private get Predicates(): Array<any> {
    const filters = this.selectedFilters;
    return Object.keys(filters).map((name: string) => {
      if (name === "name" && filters[name]) {
        return (item) =>
          item.detail.name.toLowerCase().includes(filters[name].toLowerCase());
      }
      if (name === "accreditation" && filters[name]) {
        return (item) =>
          item.accreditation?.some(
            (accred) =>
              accred.category.toLowerCase() === filters[name].toLowerCase()
          );
      }
      if (name === "rating" && filters[name]) {
        return (item) => +item.rating === +filters[name];
      }

      return (t) => true;
    });
  }

  buildFormFilters() {
    this.resourcePoolForm = new FormGroup({
      name: new FormControl(""),
      accreditation: new FormControl(""),
      rating: new FormControl(""),
    });
  }

  sortData(event) {}

  toInterview(el) {
  }

  toInvite(el) {
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
