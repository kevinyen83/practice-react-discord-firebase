import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, takeUntil } from "rxjs/operators";
import { EMPTY, Subject } from "rxjs";

import { fuseAnimations } from "@fuse/animations";
import { AuditLogService } from "app/core/services/audit-log/audit-log.service";
import { ResourcesService } from "app/core/services/resource/resources.service";

@Component({
  selector: "app-audit-log",
  templateUrl: "./audit-log.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuditLogComponent implements OnInit, OnDestroy {
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  logs = [];
  searchLogs: FormGroup;
  searchLog: FormControl;
  unsubscribeAll = new Subject<any>();
  displayedColumns: string[] = [
    "email",
    "event",
    "auditableType",
    "url",
    "ipAddress",
    "userAgent",
    "createdAt",
  ];
  dataSource: MatTableDataSource<any[]>;

  constructor(
    private router: Router,
    private resourcesService: ResourcesService,
    private auditLogService: AuditLogService,
    private formBuilder: FormBuilder
  ) {
    this.searchLog = this.formBuilder.control("");
  }

  ngOnInit(): void {
    this.createSearchLogForm();
    this.auditLogService.getAuditLogs();
    this.auditLogService.logs
      .pipe(takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }))
      .subscribe((res) => {
        this.logs = res;
        const data = this.logs.slice();
        this.dataSource = new MatTableDataSource(
          data.sort((a, b) =>
            this.compare(a.email.toLowerCase(), b.email.toLowerCase(), true)
          )
        );
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
        this.dataSource.sort = this.sort;
      });

    this.searchLog.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        const data = this.resourcesService.searchResources(
          [...this.logs],
          value
        );
        this.dataSource = new MatTableDataSource<any[]>(
          data.sort((a, b) =>
            this.compare(a.email.toLowerCase(), b.email.toLowerCase(), true)
          )
        );
        if (!value) {
          this.dataSource = new MatTableDataSource<any[]>(this.logs);
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  sortData(sort: Sort) {
    const data = this.logs.slice();
    if (!sort.active || !sort.direction) {
      this.dataSource = new MatTableDataSource<any[]>(data);
      this.dataSource.paginator = this.paginator;
      return;
    }
    this.dataSource = new MatTableDataSource<any[]>(
      data.sort((a, b) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "email":
            return this.compare(a.email, b.email, isAsc);
          case "event":
            return this.compare(a.eventType, b.eventType, isAsc);
          case "auditableType":
            return this.compare(a.auditableType, b.auditableType, isAsc);
          case "url":
            return this.compare(a.url, b.url, isAsc);
          case "ipAddress":
            return this.compare(a.ipAddress, b.ipAddress, isAsc);
          case "userAgent":
            return this.compare(a.userAgent, b.userAgent, isAsc);
          case "createdAt":
            return this.compare(a.dateOfEvent, b.dateOfEvent, isAsc);
          default:
            return 0;
        }
      })
    );
    this.dataSource.paginator = this.paginator;
  }

  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  createSearchLogForm(): void {
    this.searchLogs = this.formBuilder.group({
      searchLog: "",
    });
  }

  toCurrentLog(row) {
    this.router.navigate([`pages/audit-log/${row.id}`]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
