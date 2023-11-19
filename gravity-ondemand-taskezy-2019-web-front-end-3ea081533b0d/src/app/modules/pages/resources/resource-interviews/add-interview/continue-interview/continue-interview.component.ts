import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { catchError, EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-continue-interview',
  templateUrl: './continue-interview.component.html'
})
export class ContinueInterviewComponent implements OnInit, OnDestroy {
  @Input() currentId;
  @Output() changeViewAddInterview = new EventEmitter<boolean>();

  continueInterviewForm: FormGroup;
  currentMark;
  interviews = [];
  unsubscribeAll = new Subject<any>();
  currentInterview: any;

  constructor(private resourceService: ResourcesService) {}

  ngOnInit() {
    this.createContinueInterviewForm();
    this.resourceService
      .getInterviews()
      .pipe(
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.interviews = res[0].data;
      });
    this.currentInterview = this.interviews.find((interview) => interview.id === this.currentId);
  }

  createContinueInterviewForm(): FormGroup {
    return (this.continueInterviewForm = new FormGroup({
      question1: new FormControl(''),
      question2: new FormControl(''),
      question3: new FormControl(''),
      question4: new FormControl(''),
      question5: new FormControl(''),
      question6: new FormControl(''),
      question7: new FormControl(''),
      question8: new FormControl(''),
      question9: new FormControl(''),
      additionalNotes: new FormControl(''),
      rsaLicence: new FormControl(false),
      aidCertificate: new FormControl(false),
      driversLicence: new FormControl(false)
    }));
  }

  saveInterview() {
    this.currentInterview.question1 = this.continueInterviewForm.get('question1').value;
    this.currentInterview.question2 = this.continueInterviewForm.get('question2').value;
    this.currentInterview.question3 = this.continueInterviewForm.get('question3').value;
    this.currentInterview.question4 = this.continueInterviewForm.get('question4').value;
    this.currentInterview.question5 = this.continueInterviewForm.get('question5').value;
    this.currentInterview.question6 = this.continueInterviewForm.get('question6').value;
    this.currentInterview.question7 = this.continueInterviewForm.get('question7').value;
    this.currentInterview.question8 = this.continueInterviewForm.get('question8').value;
    this.currentInterview.question9 = this.continueInterviewForm.get('question9').value;
    this.currentInterview.additionalNotes = this.continueInterviewForm.value.additionalNotes;
    this.currentInterview.rsaLicence = this.continueInterviewForm.value.rsaLicence;
    this.currentInterview.aidCertificate = this.continueInterviewForm.value.aidCertificate;
    this.currentInterview.driversLicence = this.continueInterviewForm.value.driversLicence;
    this.currentInterview.createdAt = moment();
    this.currentInterview.updatedAt = moment();
    this.interviews = this.interviews.filter((interview) => interview.id !== this.currentInterview.id);
    this.interviews.push(this.currentInterview);
    this.resourceService.updateInterviews(this.interviews);
    this.changeViewAddInterview.emit(false);
  }

  changeMark(event) {
    this.currentMark = event;
  }

  chooseQuestion(value) {
    this.continueInterviewForm.get(value).patchValue(this.currentMark.rating);
  }

  cancelInterview() {
    this.changeViewAddInterview.emit(false);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
