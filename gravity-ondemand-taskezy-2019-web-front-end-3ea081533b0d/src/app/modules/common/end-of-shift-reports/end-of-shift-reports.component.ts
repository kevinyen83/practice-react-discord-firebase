import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-end-of-shift-reports',
  templateUrl: './end-of-shift-reports.component.html',
  animations: fuseAnimations
})
export class EndOfShiftReportsComponent implements OnInit {
  endOfShiftReportsData = [{}, {}, {}, {}];
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dateCreated', 'createdBy', 'lastModified', 'file'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.endOfShiftReportsData);
  }

  sortData(event) {

  }

}
