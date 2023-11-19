import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { catchError, EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AnswerOptionFormComponent } from './answer-option-form/answer-option-form.component';
import { InterviewsService } from 'app/core/services/interviews/interviews.service';

@Component({
  selector: 'app-templates-interview-form',
  templateUrl: './templates-interview-form.component.html'
})
export class TemplatesInterviewFormComponent implements OnInit, OnDestroy {
  @Output() formClose = new EventEmitter<any>();
  @Input() templateItem;

  templatesForm: FormGroup;
  questions: FormArray;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean;
  listAnswerOption = [
    'Text',
    'Select'
  ];
  answerOptionList = [];
  formStatus = 'add';

  private unsubscribeAll = new Subject();

  constructor(private interviewsService: InterviewsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.templateItem) {
      this.createAnswersFormUpdate();
    } else {
      this.createAnswersFormInit();
    }
  }

  createAnswersFormInit() {
    this.formStatus = 'add';
    this.templatesForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      questions: new FormArray([this.createQuestion()])
    });
  }

  createAnswersFormUpdate() {
    this.formStatus = 'edit';
    this.templatesForm = new FormGroup({
      name: new FormControl(this.templateItem.name),
      description: new FormControl(this.templateItem.description),
      questions: new FormArray([])
    });

    if (this.templateItem.questions && this.templateItem.questions.length > 0) {
      this.questions = this.templatesForm.get('questions') as FormArray;
      for (const item of this.templateItem.questions) {
        this.questions.push(this.createQuestionUpdate(item));
      }
    }
  }

  createQuestion() {
    this.answerOptionList.push([]);
    return new FormGroup({
      questionName: new FormControl(''),
      answerOption: new FormControl('')
    });
  }

  createQuestionUpdate(item) {
    this.answerOptionList.push(item.options);
    return new FormGroup({
      questionName: new FormControl(item.questionName),
      answerOption: new FormControl(item.answerOption)
    });
  }

  handleClose() {
    this.formClose.emit();
  }

  handleSave() {
    if (this.templatesForm.invalid) {
      for (let control in this.templatesForm.controls) {
        this.templatesForm.controls[control].markAsTouched();
      }
      return;
    }
    const param = {
      ...this.templatesForm.value,
      createdBy: 'Marc',
      date: moment()
    };

    for (let index = 0; index < param.questions.length; index++) {
      param.questions[index]['options'] = this.answerOptionList[index];
    }

    if (this.formStatus === 'add') {
      this.interviewsService
        .postTemplate(param)
        .pipe(
          catchError((err) => {
            console.log(err);
            // Set the alert
            this.alert = {
              type: 'error',
              message: `${err.error}`
            };

            // Show the alert
            this.showAlert = true;
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe((res) => {
          this.formClose.emit();
        });
    } else {
      param.id = this.templateItem.id;
      this.interviewsService
        .putTemplate(param)
        .pipe(
          catchError((err) => {
            console.log(err);
            // Set the alert
            this.alert = {
              type: 'error',
              message: `${err.error}`
            };

            // Show the alert
            this.showAlert = true;
            return EMPTY;
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe((res) => {
          this.formClose.emit();
        });
    }
  }

  handleAddQuestion() {
    this.questions = this.templatesForm.get('questions') as FormArray;
    this.questions.push(this.createQuestion());
  }

  changeAnswerOption(event) {}

  handleAnswerOptionList(index) {
    const dialogRef = this.dialog.open(AnswerOptionFormComponent, {
      width: '450px',
      data: {
        options: this.answerOptionList[index]
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.answerOptionList.splice(index, 1, res);
    });
  }

  handleRemoveQuestion(index) {
    this.questions = this.templatesForm.get('questions') as FormArray;
    this.questions.removeAt(index);
    this.answerOptionList.splice(index, 1);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
