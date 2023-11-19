import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Subject, takeUntil } from 'rxjs';

import { InterviewsService } from 'app/core/services/interviews/interviews.service';
import { fuseAnimations } from '@fuse/animations';
import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  animations: fuseAnimations
})
export class AddInterviewComponent implements OnInit, OnDestroy {
  templates = [];
  interviewFormSend: FormGroup;

  private unsubscribeAll = new Subject();

  constructor(private interviewsService: InterviewsService, private accountService: AccountService, private dialogRef: MatDialogRef<AddInterviewComponent>) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.createInterviewFormSend();
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
        // this.dataSource = new MatTableDataSource<any[]>(this.templates);
      });
  }

  createInterviewFormSend() {
    this.interviewFormSend = new FormGroup({
      template: new FormControl(''),
      email: new FormControl('')
    });
  }

  sentInterview() {
    const interview = {
      template: this.interviewFormSend.get('template').value,
      email: this.interviewFormSend.get('email').value,
      updated: moment(),
      status: 'pending'
    };
    this.interviewsService
      .postInterview(interview)
      .pipe(
        tap((res) => {
          this.interviewsService.postInterviewResource(interview);
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        this.dialogRef.close(res);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
