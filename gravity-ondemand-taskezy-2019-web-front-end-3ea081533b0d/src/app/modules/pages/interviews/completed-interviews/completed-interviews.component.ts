import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InterviewsService } from 'app/core/services/interviews/interviews.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-completed-interviews',
  templateUrl: './completed-interviews.component.html',
  animations: fuseAnimations
})
export class CompletedInterviewsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  templates = [];
  dataSource = new MatTableDataSource<any[]>();
  displayedColumns = [
    'email',
    'template',
    'status',
    'updated',
    'action'
  ];
  interviews = [];
  unsubscribeAll = new Subject();
  viewList = true;
  selectedInterview = {};

  constructor(private interviewsService: InterviewsService) {}

  ngOnInit(): void {
    combineLatest([
      this.interviewsService.getInterviewsAdmins(),
      this.interviewsService.getTemplates()
    ])
      .pipe(
        // takeUntil(this.unsubscribeAll),
        tap((res) => {
          if (res[0] && res[0].length > 0) {
            this.interviews = res[0].filter((item) => item.status === 'completed');
          }
          if (res[1] && res[1].length > 0) {
            this.templates = res[1];
          }

          if (this.interviews.length > 0 && this.templates.length > 0) {
            for (const interview of this.interviews) {
              const template = this.templates.find((item) => item.id === interview.templateId);
              if (template) {
                interview['questions'] = template.questions;
              }
            }
          }

          this.dataSource = new MatTableDataSource(this.interviews);
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  viewDetail(detail) {
    this.viewList = false;
    this.selectedInterview = detail;
  }

  sortData(event) {}

  handleBack() {
    this.selectedInterview = {};
    this.viewList = true;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
