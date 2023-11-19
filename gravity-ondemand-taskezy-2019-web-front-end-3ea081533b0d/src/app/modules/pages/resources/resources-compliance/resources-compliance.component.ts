import { catchError, switchMap, tap } from "rxjs/operators";
import { AccountService } from "app/core/services/account/account.service";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { EMPTY, Subject } from "rxjs";

import { fuseAnimations } from "@fuse/animations";
import { ResourcesService } from "app/core/services/resource/resources.service";

@Component({
  selector: "app-resources-compliance",
  templateUrl: "./resources-compliance.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ResourcesComplianceComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  resourceComplianceFiltersForm: FormGroup;
  users;
  resources = [];
  unsubscribeAll = new Subject<any>();
  searchResources: FormControl;
  displayedColumns: string[] = [
    "number",
    "avatar",
    "name",
    "email",
    "contactNumber",
    "gender",
    "dateOfBirth",
    "residencyStatus",
    "address",
    "emergency",
    "complianceIssues",
    "lastUpdated",
  ];
  dataSource: MatTableDataSource<any>;
  activeFilter;
  currentAccount: any = {};
  selectedFilters = {
    incompleteProfile: [],
    profilePic: [],
    email: [],
    address: [],
    contactNumber: [],
    contactDetails: [],
    gender: [],
    complianceIssues: [],
    dateOfBirth: [],
    connectionStatus: [],
    residencyStatus: [],
  };

  constructor(
    private resourcesService: ResourcesService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.searchResources = this.formBuilder.control("");
    this.createResourceComplianceForm();
  }

  ngOnInit() {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.accountService.currentAccount
      .pipe(
        tap((res) => {
          this.currentAccount = res;
          this.resources = this.currentAccount.resources || [];
          this.dataSource = new MatTableDataSource(this.resources);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searchResources.valueChanges
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((value) => {
            const data = this.resourcesService.searchResourcesCompliance(
              this.resources,
              value
            );
            this.dataSource = new MatTableDataSource<any>(data);
            if (value === "") {
              this.dataSource = new MatTableDataSource(this.resources);
            }
          });
        if (
          JSON.parse(localStorage.getItem("filterResourceCompliance")) &&
          JSON.parse(localStorage.getItem("filterResourceCompliance")) !==
            undefined
        ) {
          this.selectedFilters = JSON.parse(
            localStorage.getItem("filterResourceCompliance")
          );
          for (const filter in this.selectedFilters) {
            if (this.selectedFilters[filter].length) {
              this.resourceComplianceFiltersForm
                .get(filter)
                .patchValue(this.selectedFilters[filter]);
            }
          }
          this.applyFiltering();
        }
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  sortData(sort: Sort) {
    const data = this.resources.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource = new MatTableDataSource(data);
      return;
    }
    this.dataSource = new MatTableDataSource(
      data.sort((a, b) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "number":
            return this.compare(data.indexOf(a), data.indexOf(b), isAsc);
          case "name":
            return this.compare(a.name, b.name, isAsc);
          case "email":
            return this.compare(a.email, b.email, isAsc);
          case "contactNumber":
            return this.compare(a.mobileNumber, b.mobileNumber, isAsc);
          case "gender":
            return this.compare(a.gender, b.gender, isAsc);
          case "dateOfBirth":
            return this.compare(a.dateOfBirth, b.dateOfBirth, isAsc);
          case "residencyStatus":
            return this.compare(a.residencyStatus, b.residencyStatus, isAsc);
          case "address":
            return this.compare(a.address, b.address, isAsc);
          case "emergency":
            return this.compare(a, b, isAsc);
          case "complianceIssues":
            return this.compare(a.complianceIssues, b.complianceIssues, isAsc);
          case "lastUpdated":
            return this.compare(a.lastUpdated, b.lastUpdated, isAsc);
          default:
            return 0;
        }
      })
    );
  }

  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  createResourceComplianceForm(): FormGroup {
    return (this.resourceComplianceFiltersForm = new FormGroup({
      incompleteProfile: new FormControl(""),
      profilePic: new FormControl(""),
      emailAddress: new FormControl(""),
      address: new FormControl(""),
      contactNumber: new FormControl(""),
      contactDetails: new FormControl(""),
      gender: new FormControl(""),
      complianceIssues: new FormControl(""),
      dateOfBirth: new FormControl(""),
      connectionStatus: new FormControl(""),
      residencyStatus: new FormControl(""),
    }));
  }

  onChangeFilter(filter: string, event) {
    this.activeFilter = event.value;
    this.selectedFilters[filter] = event.value;
    localStorage.setItem(
      "filterResourceCompliance",
      JSON.stringify(this.selectedFilters)
    );
    this.assignCopy();
  }

  applyFiltering() {
    const predicates = this.Predicates;
    const result = this.resources.filter((resource) =>
      predicates.every((predicate) => predicate(resource))
    );
    this.dataSource = new MatTableDataSource<any>([...result]);
  }

  assignCopy() {
    this.dataSource.filteredData = [...this.resources];
  }

  private get Predicates(): Array<any> {
    const filters = this.selectedFilters;
    return Object.keys(filters).map((name: string) => {
      if (Array.isArray(filters[name]) && filters[name].length) {
        return (item) =>
          filters[name].some((value) => {
            if (value === "Yes" && name === "incompleteProfile") {
              return (
                item.profileStatus !== "" &&
                item.profileStatus !== null &&
                item.profileStatus === "Incomplete"
              );
            }
            if (value === "No" && name === "incompleteProfile") {
              return (
                item.profileStatus === "Complete" ||
                item.profileStatus === "Invited"
              );
            }
            if (value === "Yes" && name === "profilePic") {
              return item.avatar !== "" && item.avatar !== null;
            }
            if (value === "No" && name === "profilePic") {
              return item.avatar === "" || item.avatar === null;
            }
            if (name === "connectionStatus" || name === "gender") {
              if (value === "Other") {
                return item[name] !== "Male" && item[name] !== "Female";
              }
              return item[name] === value;
            }
            if (name === "contactNumber" && value === "Yes") {
              return item.mobileNumber !== "" || item.mobileNumber !== null;
            }
            if (name === "contactNumber" && value === "No") {
              return item.mobileNumber === "" || item.mobileNumber === null;
            }
            if (name === "contactDetails" && value === "Yes") {
              return item.contactNumber !== "";
            }
            if (name === "contactDetails" && value === "No") {
              return (
                item.contactNumber === "" ||
                item.contactNumber === null ||
                item.contactNumber === undefined
              );
            }
            if (value === "Yes" && item[name]) {
              return (
                item[name] !== "" &&
                item[name] !== null &&
                item[name] !== undefined
              );
            }
            if (value === "No") {
              return (
                item[name] === "" ||
                item[name] === null ||
                item[name] === undefined
              );
            }
          });
      }
      return (t) => true;
    });
  }

  toEditResource(row) {
    this.resources.forEach((resource) => {
      if (resource.id === row.id) {
        resource.status = "compliance";
      }
    });
    this.resourcesService.addResource(
      this.currentAccount.uuid,
      this.resources
    );
    const findResource = this.resources.find(
      (supplier) => supplier.id === row.id
    );
    this.router.navigate([`/pages/list-resources/${findResource.id}`]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
