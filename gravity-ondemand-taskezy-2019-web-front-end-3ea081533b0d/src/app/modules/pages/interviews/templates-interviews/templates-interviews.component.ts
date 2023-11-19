import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { catchError, EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InterviewsService } from 'app/core/services/interviews/interviews.service';

@Component({
  selector: 'app-templates-interviews',
  templateUrl: './templates-interviews.component.html',
  animations: fuseAnimations
})
export class TemplatesInterviewsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() updateTemplate = new EventEmitter<any>();

  templates = [];
  dataSource = new MatTableDataSource<any[]>();
  displayedColumns = [
    'name',
    'createdBy',
    'date',
    'action'
  ];

  private unsubscribeAll = new Subject();

  constructor(private interviewsService: InterviewsService) {}

  ngOnInit(): void {
    this.interviewsService
      .getTemplates()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        this.templates = res;
        this.dataSource = new MatTableDataSource<any[]>(this.templates);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  sortData(event) {}

  editTemplate(row) {
    this.updateTemplate.emit(row);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
