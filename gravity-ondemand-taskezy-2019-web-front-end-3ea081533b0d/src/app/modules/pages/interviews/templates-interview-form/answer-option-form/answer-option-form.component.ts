import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-answer-option-form',
  templateUrl: './answer-option-form.component.html'
})
export class AnswerOptionFormComponent implements OnInit {

  @Input() answerOptionList;

  optionsForm: FormGroup;
  answerOptions: FormArray;

  constructor(
    private dialogRef: MatDialogRef<AnswerOptionFormComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() public data?) {
  }

  ngOnInit(): void {
    if (this.data?.options && this.data?.options.length > 0) {
      this.fillOptionsForm(this.data.options);
    } else {
      this.createOptionsForm();
    }
  }

  createOptionsForm() {
    this.optionsForm = new FormGroup({
      answerOptions: new FormArray([this.createOption()])
    });
  }

  fillOptionsForm(options) {
    this.optionsForm = new FormGroup({
      answerOptions: new FormArray([])
    });

    this.answerOptions = this.optionsForm.get('answerOptions') as FormArray;

    for (const option of options) {
      this.answerOptions.push(new FormGroup({
        optionName: new FormControl(option.optionName)
      }));
    }
  }

  createOption() {
    return new FormGroup({
      optionName: new FormControl('')
    });
  }

  handleAddOption() {
    this.answerOptions = this.optionsForm.get('answerOptions') as FormArray;
    this.answerOptions.push(this.createOption());
  }

  handleRemoveOption(index) {
    this.answerOptions = this.optionsForm.get('answerOptions') as FormArray;
    this.answerOptions.removeAt(index);
  }

  closeModal() {
    this.dialogRef.close();
  }

  saveOptions() {
    const param = this.optionsForm.get('answerOptions').value;
    this.dialogRef.close(param);
  }
}
