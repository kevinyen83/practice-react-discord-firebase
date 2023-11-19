import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, EMPTY, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';

import { InterviewsService } from 'app/core/services/interviews/interviews.service';
import { AddInterviewComponent } from './add-interview/add-interview.component';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InterviewsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  interviews = [];
  displayedColumns = [
    'email',
    'template',
    'status',
    'updated'
  ];
  dataSource = new MatTableDataSource();
  selectedTabIndex = 0;
  viewTemplateList = true;
  templateItem = null;

  private unsubscribeAll = new Subject();

  constructor(private interviewService: InterviewsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.interviewService
      .getInterviewsAdmins()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        this.interviews = res;
        this.dataSource = new MatTableDataSource(this.interviews);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  sortData(event) {}

  addAction() {
    if (this.selectedTabIndex === 0) {
      const dialogRef = this.dialog.open(AddInterviewComponent, {
        width: '450px',
        data: {}
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.interviews.push(res);
          this.dataSource = new MatTableDataSource<any[]>(this.interviews);
          this.dataSource.paginator = this.paginator;
        }
      });
    }

    if (this.selectedTabIndex === 1) {
      this.viewTemplateList = false;
      this.templateItem = null;
    }
  }

  onTabChanged(index) {}

  getBtnLabel() {
    if (this.selectedTabIndex === 0) {
      return 'Add Interview';
    }

    if (this.selectedTabIndex === 1) {
      return 'Add Interview Template';
    }

    return 'Add Interview';
  }

  handleCloseTemplateForm() {
    this.viewTemplateList = true;
  }

  handleUpdateTemplate(template) {
    this.templateItem = template;
    this.viewTemplateList = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
