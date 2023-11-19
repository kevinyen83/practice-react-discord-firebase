import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { fuseAnimations } from "@fuse/animations";
import { ResourcesService } from "app/core/services/resource/resources.service";
import { catchError, EMPTY } from "rxjs";

export interface UserData {
  number: number;
  name: string;
  preferredName: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: "app-resource-interviews",
  templateUrl: "./resource-interviews.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ResourceInterviewsComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  interviews = [];
  statusForm: string;
  viewAddInterview = false;
  currentInterview;
  displayedColumns: string[] = [
    "number",
    "name",
    "preferredName",
    "createdAt",
    "updatedAt",
    "buttons",
  ];
  dataSource: MatTableDataSource<UserData>;

  constructor(private resourceService: ResourcesService) {}

  ngOnInit() {
    this.resourceService.getInterviews()
    .pipe(
      catchError((err) => {
        console.log(err);
        return EMPTY;
      })
    )
    .subscribe((res) => {
      this.interviews = res[0].data;
    });
    this.dataSource = new MatTableDataSource(this.interviews);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteInterview(element) {
    this.interviews = this.interviews.filter(
      (interview) => interview.id !== element.id
    );
    this.resourceService.updateInterviews(this.interviews);
    this.ngOnInit();
  }

  sortData(sort: Sort) {
    const data = this.interviews.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource = new MatTableDataSource(data);
      return;
    }
    this.dataSource = new MatTableDataSource(
      data.sort((a, b) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "name":
            return this.compare(a.lastName, b.lastName, isAsc);
          case "preferredName":
            return this.compare(a.preferredName, b.preferredName, isAsc);
          case "createdAt":
            return this.compare(a.createdAt, b.createdAt, isAsc);
          case "updatedAt":
            return this.compare(a.updatedAt, b.updatedAt, isAsc);
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

  viewInterview(element) {
    this.currentInterview = element;
    this.viewAddInterview = true;
    this.statusForm = "view";
  }

  addInterview() {
    this.viewAddInterview = true;
    this.statusForm = "create";
  }

  hideViewAddInterview(event) {
    this.viewAddInterview = event;
    this.ngOnInit();
  }
}
